package com.spendwise.dto.request;

import com.spendwise.entity.BillingCycle;
import com.spendwise.entity.SubscriptionStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSubscriptionRequest {

    @NotBlank(message = "Subscription name is required")
    private String name;

    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Billing cycle is required")
    private BillingCycle billingCycle;

    @NotNull(message = "Next billing date is required")
    private LocalDate nextBillingDate;

    private Long categoryId;

    @NotNull(message = "Status is required")
    private SubscriptionStatus status;
}
