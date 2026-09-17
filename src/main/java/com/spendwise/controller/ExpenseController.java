package com.spendwise.controller;

import com.spendwise.dto.request.CreateExpenseRequest;
import com.spendwise.dto.request.UpdateExpenseRequest;
import com.spendwise.dto.response.ExpenseResponse;
import com.spendwise.dto.response.PageResponse;
import com.spendwise.entity.PaymentMethod;
import com.spendwise.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponse<ExpenseResponse>> getExpenses(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String[] sort) {

        if (size > 50) {
            size = 50; // Max page size limit
        }

        List<Sort.Order> orders = new ArrayList<>();
        if (sort != null && sort.length > 0) {
            // Spring supports single sort param "sort=field,desc" or multiple "sort=field1,asc&sort=field2,desc"
            // If sort format is "field,dir"
            if (sort[0].contains(",")) {
                for (String sortOrder : sort) {
                    String[] _sort = sortOrder.split(",");
                    orders.add(new Sort.Order(Sort.Direction.fromString(_sort[1]), _sort[0]));
                }
            } else {
                // If it's just "sort=field"
                orders.add(new Sort.Order(Sort.Direction.ASC, sort[0]));
            }
        } else {
            // Default sort
            orders.add(new Sort.Order(Sort.Direction.DESC, "expenseDate"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(orders));

        PageResponse<ExpenseResponse> response = expenseService.getExpenses(
                categoryId, paymentMethod, startDate, endDate, minAmount, maxAmount, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        ExpenseResponse response = expenseService.getExpenseById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExpenseRequest request) {
        ExpenseResponse response = expenseService.updateExpense(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
