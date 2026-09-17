package com.spendwise.dto.response;

import com.spendwise.entity.BudgetHealthStatus;
import com.spendwise.entity.BudgetPeriod;
import com.spendwise.entity.BudgetStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BudgetResponse {
    private Long id;
    private String name;
    private BigDecimal amount;
    private BudgetPeriod period;
    private CategoryResponse category; // Can be null if general budget
    private LocalDate startDate;
    private LocalDate endDate;
    private BudgetStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Calculated fields
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private BigDecimal percentageUsed;
    private BudgetHealthStatus healthStatus;
}
