package com.spendwise.dto.response;

import com.spendwise.entity.BillingCycle;
import com.spendwise.entity.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal amount;
    private BillingCycle billingCycle;
    private LocalDate nextBillingDate;
    private CategoryResponse category;
    private SubscriptionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
