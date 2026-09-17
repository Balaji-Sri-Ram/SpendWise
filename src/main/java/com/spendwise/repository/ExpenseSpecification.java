package com.spendwise.repository;

import com.spendwise.entity.Expense;
import com.spendwise.entity.PaymentMethod;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseSpecification {

    public static Specification<Expense> belongsToUser(Long userId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Expense> hasCategoryId(Long categoryId) {
        return (root, query, criteriaBuilder) ->
                categoryId == null ? null : criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Expense> hasPaymentMethod(PaymentMethod paymentMethod) {
        return (root, query, criteriaBuilder) ->
                paymentMethod == null ? null : criteriaBuilder.equal(root.get("paymentMethod"), paymentMethod);
    }

    public static Specification<Expense> dateGreaterThanOrEqualTo(LocalDate startDate) {
        return (root, query, criteriaBuilder) ->
                startDate == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("expenseDate"), startDate);
    }

    public static Specification<Expense> dateLessThanOrEqualTo(LocalDate endDate) {
        return (root, query, criteriaBuilder) ->
                endDate == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("expenseDate"), endDate);
    }

    public static Specification<Expense> amountGreaterThanOrEqualTo(BigDecimal minAmount) {
        return (root, query, criteriaBuilder) ->
                minAmount == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("amount"), minAmount);
    }

    public static Specification<Expense> amountLessThanOrEqualTo(BigDecimal maxAmount) {
        return (root, query, criteriaBuilder) ->
                maxAmount == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("amount"), maxAmount);
    }
}
