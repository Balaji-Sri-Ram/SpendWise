package com.spendwise.service;

import com.spendwise.dto.response.*;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        User user = securityUtils.getCurrentUser();
        Long userId = user.getId();

        BigDecimal totalSpent = expenseRepository.getTotalSpent(userId);
        if (totalSpent == null) {
            totalSpent = BigDecimal.ZERO;
        }

        LocalDate now = LocalDate.now();
        LocalDate startOfThisMonth = now.withDayOfMonth(1);
        LocalDate endOfThisMonth = now.withDayOfMonth(now.lengthOfMonth());
        LocalDate startOfLastMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate endOfLastMonth = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());

        BigDecimal thisMonthSpent = expenseRepository.getSpentBetweenDates(userId, startOfThisMonth, endOfThisMonth);
        if (thisMonthSpent == null) {
            thisMonthSpent = BigDecimal.ZERO;
        }

        BigDecimal lastMonthSpent = expenseRepository.getSpentBetweenDates(userId, startOfLastMonth, endOfLastMonth);
        if (lastMonthSpent == null) {
            lastMonthSpent = BigDecimal.ZERO;
        }

        BigDecimal monthlyChangePercentage = BigDecimal.ZERO;
        if (lastMonthSpent.compareTo(BigDecimal.ZERO) > 0) {
            monthlyChangePercentage = thisMonthSpent.subtract(lastMonthSpent)
                    .divide(lastMonthSpent, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, RoundingMode.HALF_UP);
        } else if (thisMonthSpent.compareTo(BigDecimal.ZERO) > 0) {
            monthlyChangePercentage = new BigDecimal("100.00");
        }

        Long transactionCount = expenseRepository.countByUserId(userId);
        
        BigDecimal averageExpense = BigDecimal.ZERO;
        if (transactionCount > 0) {
            averageExpense = totalSpent.divide(BigDecimal.valueOf(transactionCount), 2, RoundingMode.HALF_UP);
        }

        List<Object[]> categoryBreakdown = expenseRepository.getCategoryBreakdown(userId);
        String topCategory = null;
        if (!categoryBreakdown.isEmpty()) {
            topCategory = (String) categoryBreakdown.get(0)[1];
        }

        return DashboardSummaryResponse.builder()
                .totalSpent(totalSpent)
                .thisMonthSpent(thisMonthSpent)
                .lastMonthSpent(lastMonthSpent)
                .monthlyChangePercentage(monthlyChangePercentage)
                .transactionCount(transactionCount)
                .averageExpense(averageExpense)
                .topCategory(topCategory)
                .build();
    }

    @Transactional(readOnly = true)
    public List<MonthlySpendingResponse> getMonthlySpending(int months) {
        User user = securityUtils.getCurrentUser();
        Long userId = user.getId();

        if (months <= 0) {
            months = 6;
        } else if (months > 24) {
            months = 24;
        }

        LocalDate startDate = LocalDate.now().minusMonths(months - 1).withDayOfMonth(1);

        List<Object[]> rawData = expenseRepository.getMonthlySpending(userId, startDate);
        List<MonthlySpendingResponse> response = new ArrayList<>();

        for (Object[] row : rawData) {
            Number year = (Number) row[0];
            Number month = (Number) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            String monthStr = String.format("%04d-%02d", year.intValue(), month.intValue());
            response.add(new MonthlySpendingResponse(monthStr, amount));
        }

        // Fill in missing months with zero
        List<MonthlySpendingResponse> filledResponse = new ArrayList<>();
        YearMonth current = YearMonth.from(startDate);
        YearMonth end = YearMonth.now();

        while (!current.isAfter(end)) {
            String monthStr = String.format("%04d-%02d", current.getYear(), current.getMonthValue());
            BigDecimal amount = response.stream()
                    .filter(r -> r.getMonth().equals(monthStr))
                    .map(MonthlySpendingResponse::getAmount)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            
            filledResponse.add(new MonthlySpendingResponse(monthStr, amount));
            current = current.plusMonths(1);
        }

        return filledResponse;
    }

    @Transactional(readOnly = true)
    public List<CategoryBreakdownResponse> getCategoryBreakdown() {
        User user = securityUtils.getCurrentUser();
        Long userId = user.getId();

        BigDecimal totalSpent = expenseRepository.getTotalSpent(userId);
        if (totalSpent == null || totalSpent.compareTo(BigDecimal.ZERO) == 0) {
            return new ArrayList<>();
        }

        List<Object[]> rawData = expenseRepository.getCategoryBreakdown(userId);
        List<CategoryBreakdownResponse> response = new ArrayList<>();

        for (Object[] row : rawData) {
            Long categoryId = ((Number) row[0]).longValue();
            String categoryName = (String) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            BigDecimal percentage = amount.divide(totalSpent, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(1, RoundingMode.HALF_UP);

            response.add(new CategoryBreakdownResponse(categoryId, categoryName, amount, percentage));
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getRecentExpenses() {
        User user = securityUtils.getCurrentUser();
        Long userId = user.getId();

        Page<Expense> recentExpenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId, PageRequest.of(0, 5));

        return recentExpenses.getContent().stream().map(expense -> {
            CategoryResponse categoryResponse = CategoryResponse.builder()
                    .id(expense.getCategory().getId())
                    .name(expense.getCategory().getName())
                    .description(expense.getCategory().getDescription())
                    .createdAt(expense.getCategory().getCreatedAt())
                    .build();

            return ExpenseResponse.builder()
                    .id(expense.getId())
                    .amount(expense.getAmount())
                    .description(expense.getDescription())
                    .category(categoryResponse)
                    .paymentMethod(expense.getPaymentMethod())
                    .expenseDate(expense.getExpenseDate())
                    .createdAt(expense.getCreatedAt())
                    .updatedAt(expense.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TopCategoryResponse> getTopCategories() {
        User user = securityUtils.getCurrentUser();
        Long userId = user.getId();

        List<Object[]> rawData = expenseRepository.getCategoryBreakdown(userId);
        List<TopCategoryResponse> response = new ArrayList<>();

        int count = 0;
        for (Object[] row : rawData) {
            if (count >= 5) break;
            
            String categoryName = (String) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            response.add(new TopCategoryResponse(categoryName, amount));
            count++;
        }

        return response;
    }
}
