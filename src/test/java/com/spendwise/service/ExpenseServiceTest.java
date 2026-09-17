package com.spendwise.service;

import com.spendwise.dto.request.CreateExpenseRequest;
import com.spendwise.dto.response.ExpenseResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Expense;
import com.spendwise.entity.PaymentMethod;
import com.spendwise.entity.User;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private ExpenseService expenseService;

    private User mockUser;
    private Category mockCategory;

    @BeforeEach
    void setUp() {
        mockUser = User.builder().id(1L).email("user@example.com").build();
        mockCategory = Category.builder().id(10L).name("Food").user(mockUser).build();
    }

    @Test
    void createExpense_Success() {
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setAmount(new BigDecimal("100.50"));
        request.setDescription("Dinner");
        request.setCategoryId(10L);
        request.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        request.setExpenseDate(LocalDate.now());

        when(securityUtils.getCurrentUser()).thenReturn(mockUser);
        when(categoryService.getCategoryEntityById(10L)).thenReturn(mockCategory);

        Expense savedExpense = Expense.builder()
                .id(500L)
                .amount(new BigDecimal("100.50"))
                .description("Dinner")
                .category(mockCategory)
                .paymentMethod(PaymentMethod.CREDIT_CARD)
                .expenseDate(LocalDate.now())
                .user(mockUser)
                .build();
                
        when(expenseRepository.save(any(Expense.class))).thenReturn(savedExpense);

        ExpenseResponse response = expenseService.createExpense(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("100.50"), response.getAmount());
        assertEquals(10L, response.getCategory().getId());
        verify(expenseRepository).save(any(Expense.class));
    }
}
