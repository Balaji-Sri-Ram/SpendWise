package com.spendwise.controller;

import com.spendwise.dto.response.BudgetAnalyticsResponse;
import com.spendwise.dto.response.BudgetResponse;
import com.spendwise.dto.request.CreateBudgetRequest;
import com.spendwise.dto.request.UpdateBudgetRequest;
import com.spendwise.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets() {
        return ResponseEntity.ok(budgetService.getBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudget(id));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody CreateBudgetRequest request) {
        return new ResponseEntity<>(budgetService.createBudget(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id, @Valid @RequestBody UpdateBudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/pause")
    public ResponseEntity<BudgetResponse> pauseBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.pauseBudget(id));
    }

    @PatchMapping("/{id}/resume")
    public ResponseEntity<BudgetResponse> resumeBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.resumeBudget(id));
    }

    @GetMapping("/analytics")
    public ResponseEntity<BudgetAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(budgetService.getAnalytics());
    }
}
