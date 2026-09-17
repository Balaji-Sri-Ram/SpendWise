package com.spendwise.service;

import com.spendwise.dto.request.CreateExpenseRequest;
import com.spendwise.dto.request.UpdateExpenseRequest;
import com.spendwise.dto.response.CategoryResponse;
import com.spendwise.dto.response.ExpenseResponse;
import com.spendwise.dto.response.PageResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Expense;
import com.spendwise.entity.PaymentMethod;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.ExpenseSpecification;
import com.spendwise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;
    private final SecurityUtils securityUtils;

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        
        // This implicitly checks if the category belongs to the current user
        Category category = categoryService.getCategoryEntityById(request.getCategoryId());

        Expense expense = Expense.builder()
                .user(currentUser)
                .category(category)
                .amount(request.getAmount())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .expenseDate(request.getExpenseDate())
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return mapToResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public PageResponse<ExpenseResponse> getExpenses(
            Long categoryId,
            PaymentMethod paymentMethod,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            Pageable pageable) {

        User currentUser = securityUtils.getCurrentUser();

        Specification<Expense> spec = Specification
                .where(ExpenseSpecification.belongsToUser(currentUser.getId()))
                .and(ExpenseSpecification.hasCategoryId(categoryId))
                .and(ExpenseSpecification.hasPaymentMethod(paymentMethod))
                .and(ExpenseSpecification.dateGreaterThanOrEqualTo(startDate))
                .and(ExpenseSpecification.dateLessThanOrEqualTo(endDate))
                .and(ExpenseSpecification.amountGreaterThanOrEqualTo(minAmount))
                .and(ExpenseSpecification.amountLessThanOrEqualTo(maxAmount));

        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);

        List<ExpenseResponse> content = expensePage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.<ExpenseResponse>builder()
                .content(content)
                .page(expensePage.getNumber())
                .size(expensePage.getSize())
                .totalElements(expensePage.getTotalElements())
                .totalPages(expensePage.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = getExpenseEntityById(id);
        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request) {
        Expense expense = getExpenseEntityById(id);

        if (!expense.getCategory().getId().equals(request.getCategoryId())) {
            Category category = categoryService.getCategoryEntityById(request.getCategoryId());
            expense.setCategory(category);
        }

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setExpenseDate(request.getExpenseDate());

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToResponse(updatedExpense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        Expense expense = getExpenseEntityById(id);
        expenseRepository.delete(expense);
    }

    private Expense getExpenseEntityById(Long id) {
        User currentUser = securityUtils.getCurrentUser();
        return expenseRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found or does not belong to you"));
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        Category category = expense.getCategory();
        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
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
    }
}
