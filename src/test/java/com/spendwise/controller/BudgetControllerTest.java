package com.spendwise.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.spendwise.dto.response.BudgetAnalyticsResponse;
import com.spendwise.dto.response.BudgetResponse;
import com.spendwise.dto.request.CreateBudgetRequest;
import com.spendwise.dto.request.UpdateBudgetRequest;
import com.spendwise.entity.BudgetPeriod;
import com.spendwise.entity.BudgetStatus;
import com.spendwise.entity.BudgetHealthStatus;
import com.spendwise.service.BudgetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class BudgetControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private BudgetService budgetService;

    @InjectMocks
    private BudgetController budgetController;

    private BudgetResponse testResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(budgetController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        testResponse = BudgetResponse.builder()
                .id(1L)
                .name("Food Budget")
                .amount(new BigDecimal("10000.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(LocalDate.now().withDayOfMonth(1))
                .endDate(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()))
                .status(BudgetStatus.ACTIVE)
                .spentAmount(new BigDecimal("6500.00"))
                .remainingAmount(new BigDecimal("3500.00"))
                .percentageUsed(new BigDecimal("65.00"))
                .healthStatus(BudgetHealthStatus.ON_TRACK)
                .build();
    }

    @Test
    void createBudget_Success() throws Exception {
        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setName("Food Budget");
        request.setAmount(new BigDecimal("10000.00"));
        request.setPeriod(BudgetPeriod.MONTHLY);
        request.setStartDate(LocalDate.now().withDayOfMonth(1));
        request.setEndDate(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()));

        when(budgetService.createBudget(any(CreateBudgetRequest.class))).thenReturn(testResponse);

        mockMvc.perform(post("/api/budgets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Food Budget"))
                .andExpect(jsonPath("$.amount").value(10000.00));
    }

    @Test
    void getBudgets_Success() throws Exception {
        when(budgetService.getBudgets()).thenReturn(Arrays.asList(testResponse));

        mockMvc.perform(get("/api/budgets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Food Budget"));
    }

    @Test
    void getBudgetById_Success() throws Exception {
        when(budgetService.getBudget(1L)).thenReturn(testResponse);

        mockMvc.perform(get("/api/budgets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Food Budget"));
    }

    @Test
    void updateBudget_Success() throws Exception {
        UpdateBudgetRequest request = new UpdateBudgetRequest();
        request.setName("Food Budget Updated");
        request.setAmount(new BigDecimal("12000.00"));
        request.setPeriod(BudgetPeriod.MONTHLY);
        request.setStartDate(LocalDate.now().withDayOfMonth(1));
        request.setEndDate(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()));

        when(budgetService.updateBudget(eq(1L), any(UpdateBudgetRequest.class))).thenReturn(testResponse);

        mockMvc.perform(put("/api/budgets/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteBudget_Success() throws Exception {
        doNothing().when(budgetService).deleteBudget(1L);

        mockMvc.perform(delete("/api/budgets/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void pauseBudget_Success() throws Exception {
        when(budgetService.pauseBudget(1L)).thenReturn(testResponse);

        mockMvc.perform(patch("/api/budgets/1/pause"))
                .andExpect(status().isOk());
    }

    @Test
    void resumeBudget_Success() throws Exception {
        when(budgetService.resumeBudget(1L)).thenReturn(testResponse);

        mockMvc.perform(patch("/api/budgets/1/resume"))
                .andExpect(status().isOk());
    }

    @Test
    void getBudgetAnalytics_Success() throws Exception {
        BudgetAnalyticsResponse analyticsResponse = BudgetAnalyticsResponse.builder()
                .totalBudgets(1)
                .activeBudgets(1)
                .totalBudgetAmount(new BigDecimal("10000.00"))
                .totalSpentAmount(new BigDecimal("6500.00"))
                .totalRemainingAmount(new BigDecimal("3500.00"))
                .overallPercentageUsed(new BigDecimal("65.00"))
                .budgetsOverLimit(0)
                .budgetsAtRisk(0)
                .build();

        when(budgetService.getAnalytics()).thenReturn(analyticsResponse);

        mockMvc.perform(get("/api/budgets/analytics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalBudgets").value(1))
                .andExpect(jsonPath("$.totalSpentAmount").value(6500.00));
    }
}
