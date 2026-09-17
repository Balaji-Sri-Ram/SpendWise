package com.spendwise;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.spendwise.dto.request.CreateCategoryRequest;
import com.spendwise.dto.request.CreateExpenseRequest;
import com.spendwise.entity.PaymentMethod;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.spendwise.dto.request.RegisterRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
public class SecurityIsolationTest {

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

    @Test
    public void testDataIsolationBetweenUsers() throws Exception {
        // 1. Register User A
        RegisterRequest regA = new RegisterRequest();
        regA.setName("User A");
        regA.setEmail("usera" + System.currentTimeMillis() + "@test.com");
        regA.setPassword("Password123!");
        
        MvcResult resA = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regA)))
                .andExpect(status().isCreated())
                .andReturn();
                
        String tokenA = objectMapper.readTree(resA.getResponse().getContentAsString()).get("accessToken").asText();

        // 2. Register User B
        RegisterRequest regB = new RegisterRequest();
        regB.setName("User B");
        regB.setEmail("userb" + System.currentTimeMillis() + "@test.com");
        regB.setPassword("Password123!");
        
        MvcResult resB = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regB)))
                .andExpect(status().isCreated())
                .andReturn();
                
        String tokenB = objectMapper.readTree(resB.getResponse().getContentAsString()).get("accessToken").asText();

        // 3. User A creates a category
        CreateCategoryRequest catA = new CreateCategoryRequest();
        catA.setName("Food A");
        MvcResult catResA = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(catA)))
                .andExpect(status().isCreated())
                .andReturn();
        Long categoryIdA = objectMapper.readTree(catResA.getResponse().getContentAsString()).get("id").asLong();

        // 4. User B creates a category
        CreateCategoryRequest catB = new CreateCategoryRequest();
        catB.setName("Food B");
        MvcResult catResB = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + tokenB)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(catB)))
                .andExpect(status().isCreated())
                .andReturn();
        Long categoryIdB = objectMapper.readTree(catResB.getResponse().getContentAsString()).get("id").asLong();

        // 5. User A creates an expense in Category A
        CreateExpenseRequest expA = new CreateExpenseRequest();
        expA.setAmount(new BigDecimal("50.00"));
        expA.setDescription("Lunch");
        expA.setCategoryId(categoryIdA);
        expA.setPaymentMethod(PaymentMethod.CASH);
        expA.setExpenseDate(LocalDate.now());
        
        MvcResult expResA = mockMvc.perform(post("/api/expenses")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expA)))
                .andExpect(status().isCreated())
                .andReturn();
        Long expenseIdA = objectMapper.readTree(expResA.getResponse().getContentAsString()).get("id").asLong();

        // 6. ISOLATION CHECK: User B tries to read User A's expense
        mockMvc.perform(get("/api/expenses/" + expenseIdA)
                .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound()); // Must be 404 Not Found

        // 7. ISOLATION CHECK: User A tries to use User B's category
        CreateExpenseRequest expA_invalid = new CreateExpenseRequest();
        expA_invalid.setAmount(new BigDecimal("100.00"));
        expA_invalid.setDescription("Dinner");
        expA_invalid.setCategoryId(categoryIdB); // User B's category!
        expA_invalid.setPaymentMethod(PaymentMethod.CASH);
        expA_invalid.setExpenseDate(LocalDate.now());

        mockMvc.perform(post("/api/expenses")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expA_invalid)))
                .andExpect(status().isNotFound()); // 404 because Category not found for User A

        // 8. ISOLATION CHECK: User B tries to update User A's category
        catB.setName("Hacked Name");
        mockMvc.perform(put("/api/categories/" + categoryIdA)
                .header("Authorization", "Bearer " + tokenB)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(catB)))
                .andExpect(status().isNotFound());
                
        // 9. ISOLATION CHECK: User A tries to delete User B's category
        mockMvc.perform(delete("/api/categories/" + categoryIdB)
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound());
    }
}
