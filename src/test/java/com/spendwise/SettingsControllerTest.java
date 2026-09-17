package com.spendwise;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.spendwise.controller.SettingsController;
import com.spendwise.dto.request.UpdateUserSettingsRequest;
import com.spendwise.dto.response.UserSettingsResponse;
import com.spendwise.entity.CurrencyPreference;
import com.spendwise.entity.DateFormatPreference;
import com.spendwise.entity.ThemePreference;
import com.spendwise.service.SettingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class SettingsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SettingsService settingsService;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @InjectMocks
    private SettingsController settingsController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(settingsController).build();
    }

    @Test
    void getSettings_ReturnsSettings() throws Exception {
        UserSettingsResponse response = UserSettingsResponse.builder()
                .id(1L)
                .currency(CurrencyPreference.INR)
                .dateFormat(DateFormatPreference.DD_MMM_YYYY)
                .theme(ThemePreference.LIGHT)
                .emailNotifications(true)
                .budgetAlerts(true)
                .subscriptionReminders(true)
                .weeklySummary(true)
                .monthlySummary(true)
                .build();

        when(settingsService.getSettings()).thenReturn(response);

        mockMvc.perform(get("/api/settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currency").value("INR"))
                .andExpect(jsonPath("$.emailNotifications").value(true));
    }

    @Test
    void updateSettings_ReturnsUpdatedSettings() throws Exception {
        UpdateUserSettingsRequest request = UpdateUserSettingsRequest.builder()
                .currency(CurrencyPreference.USD)
                .dateFormat(DateFormatPreference.MM_DD_YYYY)
                .theme(ThemePreference.SYSTEM)
                .emailNotifications(false)
                .budgetAlerts(false)
                .subscriptionReminders(false)
                .weeklySummary(false)
                .monthlySummary(false)
                .build();

        UserSettingsResponse response = UserSettingsResponse.builder()
                .id(1L)
                .currency(CurrencyPreference.USD)
                .dateFormat(DateFormatPreference.MM_DD_YYYY)
                .theme(ThemePreference.SYSTEM)
                .emailNotifications(false)
                .budgetAlerts(false)
                .subscriptionReminders(false)
                .weeklySummary(false)
                .monthlySummary(false)
                .build();

        when(settingsService.updateSettings(any(UpdateUserSettingsRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currency").value("USD"))
                .andExpect(jsonPath("$.emailNotifications").value(false));
    }
}
