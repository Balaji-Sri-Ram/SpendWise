package com.spendwise.service;

import com.spendwise.dto.request.CreateSubscriptionRequest;
import com.spendwise.dto.request.UpdateSubscriptionRequest;
import com.spendwise.dto.response.CategoryResponse;
import com.spendwise.dto.response.SubscriptionAnalyticsResponse;
import com.spendwise.dto.response.SubscriptionResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Subscription;
import com.spendwise.entity.SubscriptionStatus;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.SubscriptionRepository;
import com.spendwise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CategoryService categoryService;
    private final SecurityUtils securityUtils;

    @Transactional
    public SubscriptionResponse createSubscription(CreateSubscriptionRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryService.getCategoryEntityById(request.getCategoryId());
        }

        Subscription subscription = Subscription.builder()
                .name(request.getName())
                .description(request.getDescription())
                .amount(request.getAmount())
                .billingCycle(request.getBillingCycle())
                .nextBillingDate(request.getNextBillingDate())
                .status(request.getStatus())
                .category(category)
                .user(currentUser)
                .build();

        Subscription saved = subscriptionRepository.save(subscription);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getSubscriptions() {
        User currentUser = securityUtils.getCurrentUser();
        List<Subscription> subscriptions = subscriptionRepository.findByUserIdOrderByNextBillingDateAsc(currentUser.getId());
        return subscriptions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionById(Long id) {
        Subscription subscription = getSubscriptionEntityById(id);
        return mapToResponse(subscription);
    }

    @Transactional
    public SubscriptionResponse updateSubscription(Long id, UpdateSubscriptionRequest request) {
        Subscription subscription = getSubscriptionEntityById(id);

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryService.getCategoryEntityById(request.getCategoryId());
        }

        subscription.setName(request.getName());
        subscription.setDescription(request.getDescription());
        subscription.setAmount(request.getAmount());
        subscription.setBillingCycle(request.getBillingCycle());
        subscription.setNextBillingDate(request.getNextBillingDate());
        subscription.setStatus(request.getStatus());
        subscription.setCategory(category);

        Subscription updated = subscriptionRepository.save(subscription);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSubscription(Long id) {
        Subscription subscription = getSubscriptionEntityById(id);
        subscriptionRepository.delete(subscription);
    }

    @Transactional(readOnly = true)
    public SubscriptionAnalyticsResponse getSubscriptionAnalytics() {
        User currentUser = securityUtils.getCurrentUser();
        List<Subscription> activeSubscriptions = subscriptionRepository.findByUserIdAndStatus(currentUser.getId(), SubscriptionStatus.ACTIVE);

        BigDecimal monthlyCommitment = BigDecimal.ZERO;
        BigDecimal yearlyCommitment = BigDecimal.ZERO;

        for (Subscription sub : activeSubscriptions) {
            BigDecimal amount = sub.getAmount();
            switch (sub.getBillingCycle()) {
                case MONTHLY:
                    monthlyCommitment = monthlyCommitment.add(amount);
                    yearlyCommitment = yearlyCommitment.add(amount.multiply(BigDecimal.valueOf(12)));
                    break;
                case YEARLY:
                    monthlyCommitment = monthlyCommitment.add(amount.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP));
                    yearlyCommitment = yearlyCommitment.add(amount);
                    break;
                case QUARTERLY:
                    monthlyCommitment = monthlyCommitment.add(amount.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP));
                    yearlyCommitment = yearlyCommitment.add(amount.multiply(BigDecimal.valueOf(4)));
                    break;
                case WEEKLY:
                    BigDecimal yearlyFromWeekly = amount.multiply(BigDecimal.valueOf(52));
                    monthlyCommitment = monthlyCommitment.add(yearlyFromWeekly.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP));
                    yearlyCommitment = yearlyCommitment.add(yearlyFromWeekly);
                    break;
            }
        }

        return SubscriptionAnalyticsResponse.builder()
                .activeSubscriptions(activeSubscriptions.size())
                .monthlyCommitment(monthlyCommitment)
                .yearlyCommitment(yearlyCommitment)
                .build();
    }

    private Subscription getSubscriptionEntityById(Long id) {
        User currentUser = securityUtils.getCurrentUser();
        return subscriptionRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found or does not belong to you"));
    }

    private SubscriptionResponse mapToResponse(Subscription subscription) {
        CategoryResponse categoryResponse = null;
        if (subscription.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(subscription.getCategory().getId())
                    .name(subscription.getCategory().getName())
                    .description(subscription.getCategory().getDescription())
                    .createdAt(subscription.getCategory().getCreatedAt())
                    .build();
        }

        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .name(subscription.getName())
                .description(subscription.getDescription())
                .amount(subscription.getAmount())
                .billingCycle(subscription.getBillingCycle())
                .nextBillingDate(subscription.getNextBillingDate())
                .category(categoryResponse)
                .status(subscription.getStatus())
                .createdAt(subscription.getCreatedAt())
                .updatedAt(subscription.getUpdatedAt())
                .build();
    }
}
