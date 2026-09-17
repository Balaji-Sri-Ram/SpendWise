package com.spendwise.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class SettingsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SettingsService settingsService;

    @InjectMocks
    private SettingsController settingsController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(settingsController).build();
    }

    @Test
    public void testGetSettingsReturnsOk() throws Exception {
        UserSettingsResponse response = new UserSettingsResponse();
        response.setTheme(ThemePreference.LIGHT);
        when(settingsService.getSettings()).thenReturn(response);

        mockMvc.perform(get("/api/settings")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateSettingsWithGlassTheme() throws Exception {
        UpdateUserSettingsRequest request = new UpdateUserSettingsRequest();
        request.setCurrency(CurrencyPreference.INR);
        request.setDateFormat(DateFormatPreference.DD_MMM_YYYY);
        request.setTheme(ThemePreference.GLASS);
        request.setEmailNotifications(true);
        request.setBudgetAlerts(true);
        request.setSubscriptionReminders(true);
        request.setWeeklySummary(true);
        request.setMonthlySummary(true);

        UserSettingsResponse response = new UserSettingsResponse();
        response.setTheme(ThemePreference.GLASS);

        when(settingsService.updateSettings(any(UpdateUserSettingsRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/settings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme").value("GLASS"));
    }
}
