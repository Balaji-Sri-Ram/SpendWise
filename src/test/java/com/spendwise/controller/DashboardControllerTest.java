package com.spendwise.controller;

import com.spendwise.dto.response.*;
import com.spendwise.service.DashboardService;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class DashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(dashboardController).build();
    }

    @Test
    public void testGetSummary() throws Exception {
        DashboardSummaryResponse response = DashboardSummaryResponse.builder()
                .totalSpent(new BigDecimal("1000"))
                .thisMonthSpent(new BigDecimal("500"))
                .lastMonthSpent(new BigDecimal("400"))
                .monthlyChangePercentage(new BigDecimal("25.00"))
                .transactionCount(10L)
                .averageExpense(new BigDecimal("100.00"))
                .topCategory("Food")
                .build();

        when(dashboardService.getSummary()).thenReturn(response);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSpent").value(1000))
                .andExpect(jsonPath("$.topCategory").value("Food"));
    }

    @Test
    public void testGetMonthlySpending() throws Exception {
        List<MonthlySpendingResponse> response = List.of(
                new MonthlySpendingResponse("2026-01", new BigDecimal("500"))
        );

        when(dashboardService.getMonthlySpending(anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/dashboard/monthly-spending").param("months", "6"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].month").value("2026-01"));
    }

    @Test
    public void testGetCategoryBreakdown() throws Exception {
        List<CategoryBreakdownResponse> response = List.of(
                new CategoryBreakdownResponse(1L, "Food", new BigDecimal("500"), new BigDecimal("50.0"))
        );

        when(dashboardService.getCategoryBreakdown()).thenReturn(response);

        mockMvc.perform(get("/api/dashboard/category-breakdown"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Food"));
    }

    @Test
    public void testGetRecentExpenses() throws Exception {
        List<ExpenseResponse> response = List.of(
                ExpenseResponse.builder().id(1L).amount(new BigDecimal("100")).description("Lunch").build()
        );

        when(dashboardService.getRecentExpenses()).thenReturn(response);

        mockMvc.perform(get("/api/dashboard/recent-expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Lunch"));
    }

    @Test
    public void testGetTopCategories() throws Exception {
        List<TopCategoryResponse> response = List.of(
                new TopCategoryResponse("Food", new BigDecimal("500"))
        );

        when(dashboardService.getTopCategories()).thenReturn(response);

        mockMvc.perform(get("/api/dashboard/top-categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Food"));
    }
}
