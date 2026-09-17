package com.spendwise.service;

import com.spendwise.dto.request.CreateSubscriptionRequest;
import com.spendwise.dto.request.UpdateSubscriptionRequest;
import com.spendwise.dto.response.SubscriptionAnalyticsResponse;
import com.spendwise.dto.response.SubscriptionResponse;
import com.spendwise.entity.BillingCycle;
import com.spendwise.entity.Category;
import com.spendwise.entity.Subscription;
import com.spendwise.entity.SubscriptionStatus;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.SubscriptionRepository;
import com.spendwise.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User testUser;
    private Subscription testSubscription;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        testCategory = Category.builder()
                .id(1L)
                .name("Entertainment")
                .user(testUser)
                .build();

        testSubscription = Subscription.builder()
                .id(1L)
                .name("Netflix")
                .amount(new BigDecimal("15.99"))
                .billingCycle(BillingCycle.MONTHLY)
                .nextBillingDate(LocalDate.now().plusDays(5))
                .status(SubscriptionStatus.ACTIVE)
                .category(testCategory)
                .user(testUser)
                .build();
    }

    @Test
    void createSubscription_Success() {
        CreateSubscriptionRequest request = CreateSubscriptionRequest.builder()
                .name("Netflix")
                .amount(new BigDecimal("15.99"))
                .billingCycle(BillingCycle.MONTHLY)
                .nextBillingDate(LocalDate.now().plusDays(5))
                .status(SubscriptionStatus.ACTIVE)
                .categoryId(1L)
                .build();

        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(categoryService.getCategoryEntityById(1L)).thenReturn(testCategory);
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(testSubscription);

        SubscriptionResponse response = subscriptionService.createSubscription(request);

        assertNotNull(response);
        assertEquals("Netflix", response.getName());
        assertEquals(new BigDecimal("15.99"), response.getAmount());
        assertEquals(SubscriptionStatus.ACTIVE, response.getStatus());
        assertEquals(1L, response.getCategory().getId());
    }

    @Test
    void getSubscriptions_Success() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(subscriptionRepository.findByUserIdOrderByNextBillingDateAsc(testUser.getId()))
                .thenReturn(Arrays.asList(testSubscription));

        List<SubscriptionResponse> responses = subscriptionService.getSubscriptions();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Netflix", responses.get(0).getName());
    }

    @Test
    void getSubscriptionById_Success() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(subscriptionRepository.findByIdAndUserId(1L, testUser.getId()))
                .thenReturn(Optional.of(testSubscription));

        SubscriptionResponse response = subscriptionService.getSubscriptionById(1L);

        assertNotNull(response);
        assertEquals("Netflix", response.getName());
    }

    @Test
    void getSubscriptionById_NotFound() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(subscriptionRepository.findByIdAndUserId(1L, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> subscriptionService.getSubscriptionById(1L));
    }

    @Test
    void updateSubscription_Success() {
        UpdateSubscriptionRequest request = UpdateSubscriptionRequest.builder()
                .name("Netflix Updated")
                .amount(new BigDecimal("19.99"))
                .billingCycle(BillingCycle.MONTHLY)
                .nextBillingDate(LocalDate.now().plusDays(10))
                .status(SubscriptionStatus.ACTIVE)
                .categoryId(1L)
                .build();

        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(subscriptionRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testSubscription));
        when(categoryService.getCategoryEntityById(1L)).thenReturn(testCategory);
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(testSubscription);

        SubscriptionResponse response = subscriptionService.updateSubscription(1L, request);

        assertNotNull(response);
        verify(subscriptionRepository).save(any(Subscription.class));
    }

    @Test
    void deleteSubscription_Success() {
        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(subscriptionRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testSubscription));

        subscriptionService.deleteSubscription(1L);

        verify(subscriptionRepository).delete(testSubscription);
    }

    @Test
    void getSubscriptionAnalytics_Success() {
        Subscription yearlySub = Subscription.builder()
                .amount(new BigDecimal("120.00"))
                .billingCycle(BillingCycle.YEARLY)
                .status(SubscriptionStatus.ACTIVE)
                .build();

        Subscription monthlySub = Subscription.builder()
                .amount(new BigDecimal("10.00"))
                .billingCycle(BillingCycle.MONTHLY)
                .status(SubscriptionStatus.ACTIVE)
                .build();

        when(securityUtils.getCurrentUser()).thenReturn(testUser);
        when(subscriptionRepository.findByUserIdAndStatus(testUser.getId(), SubscriptionStatus.ACTIVE))
                .thenReturn(Arrays.asList(yearlySub, monthlySub));

        SubscriptionAnalyticsResponse analytics = subscriptionService.getSubscriptionAnalytics();

        assertNotNull(analytics);
        assertEquals(2, analytics.getActiveSubscriptions());
        
        // monthly = 10 + (120/12) = 20
        assertEquals(0, new BigDecimal("20.00").compareTo(analytics.getMonthlyCommitment()));
        // yearly = (10*12) + 120 = 240
        assertEquals(0, new BigDecimal("240.00").compareTo(analytics.getYearlyCommitment()));
    }
}
