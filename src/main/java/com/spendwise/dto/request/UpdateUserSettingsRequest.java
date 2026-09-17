package com.spendwise.dto.request;

import com.spendwise.entity.CurrencyPreference;
import com.spendwise.entity.DateFormatPreference;
import com.spendwise.entity.ThemePreference;
import com.spendwise.entity.FontStylePreference;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserSettingsRequest {

    @NotNull(message = "Currency preference is required")
    private CurrencyPreference currency;

    @NotNull(message = "Date format preference is required")
    private DateFormatPreference dateFormat;

    @NotNull(message = "Theme preference is required")
    private ThemePreference theme;

    @NotNull(message = "Font style preference is required")
    private FontStylePreference fontStyle;

    private boolean emailNotifications;

    private boolean budgetAlerts;

    private boolean subscriptionReminders;

    private boolean weeklySummary;

    private boolean monthlySummary;
}
