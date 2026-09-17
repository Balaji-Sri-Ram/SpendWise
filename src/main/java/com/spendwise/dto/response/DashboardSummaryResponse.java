package com.spendwise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private BigDecimal totalSpent;
    private BigDecimal thisMonthSpent;
    private BigDecimal lastMonthSpent;
    private BigDecimal monthlyChangePercentage;
    private Long transactionCount;
    private BigDecimal averageExpense;
    private String topCategory;
}
