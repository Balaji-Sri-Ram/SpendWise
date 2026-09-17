package com.spendwise.controller;

import com.spendwise.dto.response.*;
import com.spendwise.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/monthly-spending")
    public ResponseEntity<List<MonthlySpendingResponse>> getMonthlySpending(
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(dashboardService.getMonthlySpending(months));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<CategoryBreakdownResponse>> getCategoryBreakdown() {
        return ResponseEntity.ok(dashboardService.getCategoryBreakdown());
    }

    @GetMapping("/recent-expenses")
    public ResponseEntity<List<ExpenseResponse>> getRecentExpenses() {
        return ResponseEntity.ok(dashboardService.getRecentExpenses());
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<TopCategoryResponse>> getTopCategories() {
        return ResponseEntity.ok(dashboardService.getTopCategories());
    }
}
