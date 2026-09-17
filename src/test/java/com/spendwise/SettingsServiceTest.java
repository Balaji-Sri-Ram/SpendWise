package com.spendwise;

import com.spendwise.dto.request.UpdateUserSettingsRequest;
import com.spendwise.dto.response.UserSettingsResponse;
import com.spendwise.entity.CurrencyPreference;
import com.spendwise.entity.DateFormatPreference;
import com.spendwise.entity.ThemePreference;
import com.spendwise.entity.User;
import com.spendwise.entity.UserSettings;
import com.spendwise.repository.UserSettingsRepository;
import com.spendwise.security.SecurityUtils;
import com.spendwise.service.SettingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SettingsServiceTest {

    @Mock
    private UserSettingsRepository userSettingsRepository;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private SettingsService settingsService;

    private User testUser;
    private UserSettings testSettings;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .name("Test User")
                .password("encoded_password")
                .build();

        testSettings = UserSettings.builder()
                .id(1L)
                .user(testUser)
                .currency(CurrencyPreference.USD)
                .dateFormat(DateFormatPreference.MM_DD_YYYY)
                .theme(ThemePreference.LIGHT)
                .emailNotifications(false)
                .budgetAlerts(false)
                .subscriptionReminders(false)
                .weeklySummary(false)
                .monthlySummary(false)
                .build();
    }

    @Test
    void getSettings_ExistingSettings_ReturnsSettings() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(userSettingsRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(testSettings));

        UserSettingsResponse response = settingsService.getSettings();

        assertNotNull(response);
        assertEquals(CurrencyPreference.USD, response.getCurrency());
        assertFalse(response.isEmailNotifications());
    }

    @Test
    void getSettings_NoSettings_CreatesAndReturnsDefaultSettings() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(userSettingsRepository.findByUserId(testUser.getId())).thenReturn(Optional.empty());
        when(userSettingsRepository.save(any(UserSettings.class))).thenAnswer(i -> {
            UserSettings s = i.getArgument(0);
            s.setId(100L);
            return s;
        });

        UserSettingsResponse response = settingsService.getSettings();

        assertNotNull(response);
        assertEquals(CurrencyPreference.INR, response.getCurrency());
        assertEquals(DateFormatPreference.DD_MMM_YYYY, response.getDateFormat());
        assertEquals(ThemePreference.LIGHT, response.getTheme());
        assertTrue(response.isEmailNotifications());
        
        verify(userSettingsRepository).save(any(UserSettings.class));
    }

    @Test
    void updateSettings_UpdatesAndReturnsSettings() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(userSettingsRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(testSettings));
        when(userSettingsRepository.save(any(UserSettings.class))).thenAnswer(i -> i.getArgument(0));

        UpdateUserSettingsRequest request = UpdateUserSettingsRequest.builder()
                .currency(CurrencyPreference.EUR)
                .dateFormat(DateFormatPreference.YYYY_MM_DD)
                .theme(ThemePreference.SYSTEM)
                .emailNotifications(true)
                .budgetAlerts(true)
                .subscriptionReminders(true)
                .weeklySummary(true)
                .monthlySummary(true)
                .build();

        UserSettingsResponse response = settingsService.updateSettings(request);

        assertNotNull(response);
        assertEquals(CurrencyPreference.EUR, response.getCurrency());
        assertEquals(DateFormatPreference.YYYY_MM_DD, response.getDateFormat());
        assertTrue(response.isEmailNotifications());
    }

    @Test
    void resetSettings_ResetsToDefaults() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(userSettingsRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(testSettings));
        when(userSettingsRepository.save(any(UserSettings.class))).thenAnswer(i -> i.getArgument(0));

        UserSettingsResponse response = settingsService.resetSettings();

        assertNotNull(response);
        assertEquals(CurrencyPreference.INR, response.getCurrency());
        assertTrue(response.isEmailNotifications());
    }
}
