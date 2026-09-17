package com.spendwise.service;

import com.spendwise.dto.request.UpdateUserSettingsRequest;
import com.spendwise.dto.response.UserSettingsResponse;
import com.spendwise.entity.User;
import com.spendwise.entity.UserSettings;
import com.spendwise.repository.UserSettingsRepository;
import com.spendwise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public UserSettingsResponse getSettings() {
        User currentUser = securityUtils.getCurrentUser();
        
        UserSettings settings = userSettingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));
                
        return mapToResponse(settings);
    }

    @Transactional
    public UserSettingsResponse updateSettings(UpdateUserSettingsRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        
        UserSettings settings = userSettingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));
                
        settings.setCurrency(request.getCurrency());
        settings.setDateFormat(request.getDateFormat());
        settings.setTheme(request.getTheme());
        settings.setEmailNotifications(request.isEmailNotifications());
        settings.setBudgetAlerts(request.isBudgetAlerts());
        settings.setSubscriptionReminders(request.isSubscriptionReminders());
        settings.setWeeklySummary(request.isWeeklySummary());
        settings.setMonthlySummary(request.isMonthlySummary());
        
        settings = userSettingsRepository.save(settings);
        return mapToResponse(settings);
    }

    @Transactional
    public UserSettingsResponse resetSettings() {
        User currentUser = securityUtils.getCurrentUser();
        
        UserSettings settings = userSettingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));
                
        // Reset to defaults
        settings.setCurrency(com.spendwise.entity.CurrencyPreference.INR);
        settings.setDateFormat(com.spendwise.entity.DateFormatPreference.DD_MMM_YYYY);
        settings.setTheme(com.spendwise.entity.ThemePreference.LIGHT);
        settings.setEmailNotifications(true);
        settings.setBudgetAlerts(true);
        settings.setSubscriptionReminders(true);
        settings.setWeeklySummary(true);
        settings.setMonthlySummary(true);
        
        settings = userSettingsRepository.save(settings);
        return mapToResponse(settings);
    }

    private UserSettings createDefaultSettings(User user) {
        UserSettings defaultSettings = UserSettings.builder()
                .user(user)
                .currency(com.spendwise.entity.CurrencyPreference.INR)
                .dateFormat(com.spendwise.entity.DateFormatPreference.DD_MMM_YYYY)
                .theme(com.spendwise.entity.ThemePreference.LIGHT)
                .emailNotifications(true)
                .budgetAlerts(true)
                .subscriptionReminders(true)
                .weeklySummary(true)
                .monthlySummary(true)
                .build();
                
        return userSettingsRepository.save(defaultSettings);
    }

    private UserSettingsResponse mapToResponse(UserSettings settings) {
        return UserSettingsResponse.builder()
                .id(settings.getId())
                .currency(settings.getCurrency())
                .dateFormat(settings.getDateFormat())
                .theme(settings.getTheme())
                .emailNotifications(settings.isEmailNotifications())
                .budgetAlerts(settings.isBudgetAlerts())
                .subscriptionReminders(settings.isSubscriptionReminders())
                .weeklySummary(settings.isWeeklySummary())
                .monthlySummary(settings.isMonthlySummary())
                .createdAt(settings.getCreatedAt())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
