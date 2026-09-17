package com.spendwise.dto.response;

import com.spendwise.entity.CurrencyPreference;
import com.spendwise.entity.DateFormatPreference;
import com.spendwise.entity.ThemePreference;
import com.spendwise.entity.FontStylePreference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsResponse {
    private Long id;
    private CurrencyPreference currency;
    private DateFormatPreference dateFormat;
    private ThemePreference theme;
    private FontStylePreference fontStyle;
    private boolean emailNotifications;
    private boolean budgetAlerts;
    private boolean subscriptionReminders;
    private boolean weeklySummary;
    private boolean monthlySummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
