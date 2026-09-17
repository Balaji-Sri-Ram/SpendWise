package com.spendwise;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.spendwise.dto.request.CreateCategoryRequest;
import com.spendwise.dto.request.CreateExpenseRequest;
import com.spendwise.dto.request.RegisterRequest;
import com.spendwise.dto.response.*;
import com.spendwise.entity.PaymentMethod;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
public class DashboardIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("JWT_SECRET", () -> "my-very-secret-test-key-which-is-long-enough-for-hmac-sha256");
        registry.add("JWT_ACCESS_EXPIRATION", () -> "3600000");
        registry.add("JWT_REFRESH_EXPIRATION", () -> "86400000");
    }

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    private String registerAndGetToken(String username, String email) throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName(username);
        req.setEmail(email);
        req.setPassword("Password123!");

        MvcResult res = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
    }

    private Long createCategory(String token, String name) throws Exception {
        CreateCategoryRequest req = new CreateCategoryRequest();
        req.setName(name);

        MvcResult res = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();
    }

    private void createExpense(String token, Long categoryId, String amount, LocalDate date) throws Exception {
        CreateExpenseRequest req = new CreateExpenseRequest();
        req.setAmount(new BigDecimal(amount));
        req.setDescription("Expense");
        req.setCategoryId(categoryId);
        req.setPaymentMethod(PaymentMethod.CASH);
        req.setExpenseDate(date);

        mockMvc.perform(post("/api/expenses")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testDashboardWithNoExpenses() throws Exception {
        String token = registerAndGetToken("No Expense", "noexp" + System.currentTimeMillis() + "@test.com");

        MvcResult res = mockMvc.perform(get("/api/dashboard/summary")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        DashboardSummaryResponse summary = objectMapper.readValue(res.getResponse().getContentAsString(), DashboardSummaryResponse.class);
        assertEquals(0, summary.getTotalSpent().compareTo(BigDecimal.ZERO));
        assertEquals(0L, summary.getTransactionCount());
        assertNull(summary.getTopCategory());
    }

    @Test
    public void testDashboardWithExpensesAndIsolation() throws Exception {
        String tokenA = registerAndGetToken("User A", "usera_dash" + System.currentTimeMillis() + "@test.com");
        String tokenB = registerAndGetToken("User B", "userb_dash" + System.currentTimeMillis() + "@test.com");

        Long catFoodA = createCategory(tokenA, "Food A");
        Long catTransportA = createCategory(tokenA, "Transport A");

        Long catFoodB = createCategory(tokenB, "Food B");

        LocalDate thisMonth = LocalDate.now();
        LocalDate lastMonth = LocalDate.now().minusMonths(1);

        createExpense(tokenA, catFoodA, "100.00", thisMonth);
        createExpense(tokenA, catFoodA, "50.00", thisMonth);
        createExpense(tokenA, catTransportA, "200.00", lastMonth);

        createExpense(tokenB, catFoodB, "1000.00", thisMonth);

        // Check Summary User A
        MvcResult resA = mockMvc.perform(get("/api/dashboard/summary")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andReturn();

        DashboardSummaryResponse summaryA = objectMapper.readValue(resA.getResponse().getContentAsString(), DashboardSummaryResponse.class);
        assertEquals(new BigDecimal("350.00"), summaryA.getTotalSpent().setScale(2));
        assertEquals(new BigDecimal("150.00"), summaryA.getThisMonthSpent().setScale(2));
        assertEquals(new BigDecimal("200.00"), summaryA.getLastMonthSpent().setScale(2));
        assertEquals(3L, summaryA.getTransactionCount());
        assertEquals("Transport A", summaryA.getTopCategory()); // 200 > 150

        // Check Summary User B (Isolation Check)
        MvcResult resB = mockMvc.perform(get("/api/dashboard/summary")
                .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andReturn();

        DashboardSummaryResponse summaryB = objectMapper.readValue(resB.getResponse().getContentAsString(), DashboardSummaryResponse.class);
        assertEquals(new BigDecimal("1000.00"), summaryB.getTotalSpent().setScale(2));
        assertEquals("Food B", summaryB.getTopCategory());
        assertEquals(1L, summaryB.getTransactionCount());

        // Check Category Breakdown User A
        MvcResult breakdownRes = mockMvc.perform(get("/api/dashboard/category-breakdown")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andReturn();
        
        List<CategoryBreakdownResponse> breakdown = objectMapper.readValue(
                breakdownRes.getResponse().getContentAsString(),
                new TypeReference<>() {}
        );
        assertEquals(2, breakdown.size());

        // Check Recent Expenses User A
        MvcResult recentRes = mockMvc.perform(get("/api/dashboard/recent-expenses")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andReturn();

        List<ExpenseResponse> recent = objectMapper.readValue(
                recentRes.getResponse().getContentAsString(),
                new TypeReference<>() {}
        );
        assertEquals(3, recent.size());
    }
}
