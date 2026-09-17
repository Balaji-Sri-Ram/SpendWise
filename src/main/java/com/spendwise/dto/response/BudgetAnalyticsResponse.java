package com.spendwise.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetAnalyticsResponse {
    private long totalBudgets;
    private long activeBudgets;
    private BigDecimal totalBudgetAmount;
    private BigDecimal totalSpentAmount;
    private BigDecimal totalRemainingAmount;
    private BigDecimal overallPercentageUsed;
    private long budgetsOverLimit;
    private long budgetsAtRisk;
}
