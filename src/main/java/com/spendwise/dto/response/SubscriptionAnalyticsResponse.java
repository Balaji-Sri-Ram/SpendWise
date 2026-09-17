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
public class SubscriptionAnalyticsResponse {
    private long activeSubscriptions;
    private BigDecimal monthlyCommitment;
    private BigDecimal yearlyCommitment;
}
