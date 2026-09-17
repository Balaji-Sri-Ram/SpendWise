package com.spendwise.controller;

import com.spendwise.dto.request.CreateSubscriptionRequest;
import com.spendwise.dto.request.UpdateSubscriptionRequest;
import com.spendwise.dto.response.SubscriptionAnalyticsResponse;
import com.spendwise.dto.response.SubscriptionResponse;
import com.spendwise.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionResponse> createSubscription(@Valid @RequestBody CreateSubscriptionRequest request) {
        SubscriptionResponse response = subscriptionService.createSubscription(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getSubscriptions() {
        List<SubscriptionResponse> responses = subscriptionService.getSubscriptions();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> getSubscriptionById(@PathVariable Long id) {
        SubscriptionResponse response = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSubscriptionRequest request) {
        SubscriptionResponse response = subscriptionService.updateSubscription(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<SubscriptionAnalyticsResponse> getSubscriptionAnalytics() {
        SubscriptionAnalyticsResponse response = subscriptionService.getSubscriptionAnalytics();
        return ResponseEntity.ok(response);
    }
}
