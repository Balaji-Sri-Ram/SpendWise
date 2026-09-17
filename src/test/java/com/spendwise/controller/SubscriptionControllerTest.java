package com.spendwise.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.spendwise.dto.request.CreateSubscriptionRequest;
import com.spendwise.dto.request.UpdateSubscriptionRequest;
import com.spendwise.dto.response.SubscriptionAnalyticsResponse;
import com.spendwise.dto.response.SubscriptionResponse;
import com.spendwise.entity.BillingCycle;
import com.spendwise.entity.SubscriptionStatus;
import com.spendwise.service.SubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class SubscriptionControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private SubscriptionController subscriptionController;

    private SubscriptionResponse testResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(subscriptionController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        testResponse = SubscriptionResponse.builder()
                .id(1L)
                .name("Netflix")
                .amount(new BigDecimal("15.99"))
                .billingCycle(BillingCycle.MONTHLY)
                .status(SubscriptionStatus.ACTIVE)
                .nextBillingDate(LocalDate.now().plusDays(5))
                .build();
    }

    @Test
    void createSubscription_Success() throws Exception {
        CreateSubscriptionRequest request = CreateSubscriptionRequest.builder()
                .name("Netflix")
                .amount(new BigDecimal("15.99"))
                .billingCycle(BillingCycle.MONTHLY)
                .status(SubscriptionStatus.ACTIVE)
                .nextBillingDate(LocalDate.now().plusDays(5))
                .build();

        when(subscriptionService.createSubscription(any(CreateSubscriptionRequest.class))).thenReturn(testResponse);

        mockMvc.perform(post("/api/subscriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Netflix"))
                .andExpect(jsonPath("$.amount").value(15.99));
    }

    @Test
    void getSubscriptions_Success() throws Exception {
        when(subscriptionService.getSubscriptions()).thenReturn(Arrays.asList(testResponse));

        mockMvc.perform(get("/api/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Netflix"));
    }

    @Test
    void getSubscriptionById_Success() throws Exception {
        when(subscriptionService.getSubscriptionById(1L)).thenReturn(testResponse);

        mockMvc.perform(get("/api/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Netflix"));
    }

    @Test
    void updateSubscription_Success() throws Exception {
        UpdateSubscriptionRequest request = UpdateSubscriptionRequest.builder()
                .name("Netflix Updated")
                .amount(new BigDecimal("19.99"))
                .billingCycle(BillingCycle.MONTHLY)
                .status(SubscriptionStatus.ACTIVE)
                .nextBillingDate(LocalDate.now().plusDays(10))
                .build();

        when(subscriptionService.updateSubscription(eq(1L), any(UpdateSubscriptionRequest.class))).thenReturn(testResponse);

        mockMvc.perform(put("/api/subscriptions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteSubscription_Success() throws Exception {
        doNothing().when(subscriptionService).deleteSubscription(1L);

        mockMvc.perform(delete("/api/subscriptions/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getSubscriptionAnalytics_Success() throws Exception {
        SubscriptionAnalyticsResponse analyticsResponse = SubscriptionAnalyticsResponse.builder()
                .activeSubscriptions(2)
                .monthlyCommitment(new BigDecimal("50.00"))
                .yearlyCommitment(new BigDecimal("600.00"))
                .build();

        when(subscriptionService.getSubscriptionAnalytics()).thenReturn(analyticsResponse);

        mockMvc.perform(get("/api/subscriptions/analytics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeSubscriptions").value(2))
                .andExpect(jsonPath("$.monthlyCommitment").value(50.00));
    }
}
