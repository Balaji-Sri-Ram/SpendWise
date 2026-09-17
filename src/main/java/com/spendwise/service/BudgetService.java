package com.spendwise.service;

import com.spendwise.dto.response.BudgetAnalyticsResponse;
import com.spendwise.dto.response.BudgetResponse;
import com.spendwise.dto.response.CategoryResponse;
import com.spendwise.dto.request.CreateBudgetRequest;
import com.spendwise.dto.request.UpdateBudgetRequest;
import com.spendwise.entity.Budget;
import com.spendwise.entity.BudgetHealthStatus;
import com.spendwise.entity.BudgetStatus;
import com.spendwise.entity.Category;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.ExpenseRepository;
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
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets() {
        User currentUser = securityUtils.getCurrentUser();
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return budgets.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudget(Long id) {
        Budget budget = getBudgetEntity(id);
        return mapToResponse(budget);
    }

    @Transactional
    public BudgetResponse createBudget(CreateBudgetRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        Budget budget = Budget.builder()
                .user(currentUser)
                .category(category)
                .name(request.getName())
                .amount(request.getAmount())
                .period(request.getPeriod())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(BudgetStatus.ACTIVE)
                .build();

        return mapToResponse(budgetRepository.save(budget));
    }

    @Transactional
    public BudgetResponse updateBudget(Long id, UpdateBudgetRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Budget budget = getBudgetEntity(id);

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        budget.setCategory(category);
        budget.setName(request.getName());
        budget.setAmount(request.getAmount());
        budget.setPeriod(request.getPeriod());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        return mapToResponse(budgetRepository.save(budget));
    }

    @Transactional
    public void deleteBudget(Long id) {
        Budget budget = getBudgetEntity(id);
        budgetRepository.delete(budget);
    }

    @Transactional
    public BudgetResponse pauseBudget(Long id) {
        Budget budget = getBudgetEntity(id);
        budget.setStatus(BudgetStatus.PAUSED);
        return mapToResponse(budgetRepository.save(budget));
    }

    @Transactional
    public BudgetResponse resumeBudget(Long id) {
        Budget budget = getBudgetEntity(id);
        budget.setStatus(BudgetStatus.ACTIVE);
        return mapToResponse(budgetRepository.save(budget));
    }

    @Transactional(readOnly = true)
    public BudgetAnalyticsResponse getAnalytics() {
        User currentUser = securityUtils.getCurrentUser();
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        
        long totalBudgets = budgets.size();
        long activeBudgets = budgets.stream().filter(b -> b.getStatus() == BudgetStatus.ACTIVE).count();
        
        BigDecimal totalBudgetAmount = BigDecimal.ZERO;
        BigDecimal totalSpentAmount = BigDecimal.ZERO;
        long budgetsOverLimit = 0;
        long budgetsAtRisk = 0;

        for (Budget budget : budgets) {
            if (budget.getStatus() == BudgetStatus.ACTIVE) {
                totalBudgetAmount = totalBudgetAmount.add(budget.getAmount());
                
                BigDecimal spent = calculateSpentAmount(budget);
                totalSpentAmount = totalSpentAmount.add(spent);
                
                BudgetHealthStatus health = calculateHealthStatus(budget.getAmount(), spent);
                if (health == BudgetHealthStatus.OVER_BUDGET) {
                    budgetsOverLimit++;
                } else if (health == BudgetHealthStatus.WARNING) {
                    budgetsAtRisk++;
                }
            }
        }
        
        BigDecimal totalRemainingAmount = totalBudgetAmount.subtract(totalSpentAmount).max(BigDecimal.ZERO);
        BigDecimal overallPercentageUsed = BigDecimal.ZERO;
        if (totalBudgetAmount.compareTo(BigDecimal.ZERO) > 0) {
            overallPercentageUsed = totalSpentAmount.multiply(new BigDecimal("100"))
                    .divide(totalBudgetAmount, 2, RoundingMode.HALF_UP);
        }

        return BudgetAnalyticsResponse.builder()
                .totalBudgets(totalBudgets)
                .activeBudgets(activeBudgets)
                .totalBudgetAmount(totalBudgetAmount)
                .totalSpentAmount(totalSpentAmount)
                .totalRemainingAmount(totalRemainingAmount)
                .overallPercentageUsed(overallPercentageUsed)
                .budgetsOverLimit(budgetsOverLimit)
                .budgetsAtRisk(budgetsAtRisk)
                .build();
    }

    private Budget getBudgetEntity(Long id) {
        User currentUser = securityUtils.getCurrentUser();
        return budgetRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
    }

    private BudgetResponse mapToResponse(Budget budget) {
        BigDecimal spentAmount = calculateSpentAmount(budget);
        BigDecimal remainingAmount = budget.getAmount().subtract(spentAmount).max(BigDecimal.ZERO);
        
        BigDecimal percentageUsed = BigDecimal.ZERO;
        if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            percentageUsed = spentAmount.multiply(new BigDecimal("100"))
                    .divide(budget.getAmount(), 2, RoundingMode.HALF_UP);
        }
        
        BudgetHealthStatus healthStatus = calculateHealthStatus(budget.getAmount(), spentAmount);

        CategoryResponse categoryResponse = null;
        if (budget.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(budget.getCategory().getId())
                    .name(budget.getCategory().getName())
                    .description(budget.getCategory().getDescription())
                    .build();
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .name(budget.getName())
                .amount(budget.getAmount())
                .period(budget.getPeriod())
                .category(categoryResponse)
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .status(budget.getStatus())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .spentAmount(spentAmount)
                .remainingAmount(remainingAmount)
                .percentageUsed(percentageUsed)
                .healthStatus(healthStatus)
                .build();
    }

    private BigDecimal calculateSpentAmount(Budget budget) {
        BigDecimal spent;
        if (budget.getCategory() != null) {
            spent = expenseRepository.getSpentByCategoryBetweenDates(
                    budget.getUser().getId(),
                    budget.getCategory().getId(),
                    budget.getStartDate(),
                    budget.getEndDate()
            );
        } else {
            spent = expenseRepository.getSpentBetweenDates(
                    budget.getUser().getId(),
                    budget.getStartDate(),
                    budget.getEndDate()
            );
        }
        return spent != null ? spent : BigDecimal.ZERO;
    }

    private BudgetHealthStatus calculateHealthStatus(BigDecimal amount, BigDecimal spent) {
        if (amount.compareTo(BigDecimal.ZERO) == 0) {
            return spent.compareTo(BigDecimal.ZERO) > 0 ? BudgetHealthStatus.OVER_BUDGET : BudgetHealthStatus.ON_TRACK;
        }
        
        BigDecimal percentage = spent.multiply(new BigDecimal("100"))
                .divide(amount, 2, RoundingMode.HALF_UP);
                
        if (percentage.compareTo(new BigDecimal("90")) >= 0) {
            if (percentage.compareTo(new BigDecimal("100")) >= 0) {
                return BudgetHealthStatus.OVER_BUDGET;
            }
            return BudgetHealthStatus.WARNING;
        } else if (percentage.compareTo(new BigDecimal("70")) >= 0) {
            return BudgetHealthStatus.WARNING;
        }
        
        return BudgetHealthStatus.ON_TRACK;
    }
}
