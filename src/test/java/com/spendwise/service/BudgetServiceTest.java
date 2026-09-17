package com.spendwise.service;

import com.spendwise.dto.response.BudgetAnalyticsResponse;
import com.spendwise.dto.response.BudgetResponse;
import com.spendwise.dto.request.CreateBudgetRequest;
import com.spendwise.dto.request.UpdateBudgetRequest;
import com.spendwise.entity.Budget;
import com.spendwise.entity.BudgetHealthStatus;
import com.spendwise.entity.BudgetPeriod;
import com.spendwise.entity.BudgetStatus;
import com.spendwise.entity.Category;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.security.SecurityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private BudgetService budgetService;

    private User testUser;
    private Category testCategory;
    private Budget testBudget;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Food");
        testCategory.setUser(testUser);

        testBudget = Budget.builder()
                .id(1L)
                .user(testUser)
                .category(testCategory)
                .name("Food Budget")
                .amount(new BigDecimal("10000.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(LocalDate.now().withDayOfMonth(1))
                .endDate(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()))
                .status(BudgetStatus.ACTIVE)
                .build();

        // Stub securityUtils
        lenient().when(securityUtils.getCurrentUser()).thenReturn(testUser);
    }

    @AfterEach
    void tearDown() {
        // Nothing to tear down for mockStatic anymore
    }

    @Test
    void getBudgets_Success() {
        when(budgetRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId())).thenReturn(Arrays.asList(testBudget));
        when(expenseRepository.getSpentByCategoryBetweenDates(eq(1L), eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("6500.00"));

        List<BudgetResponse> responses = budgetService.getBudgets();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Food Budget", responses.get(0).getName());
        assertEquals(new BigDecimal("6500.00"), responses.get(0).getSpentAmount());
        assertEquals(new BigDecimal("3500.00"), responses.get(0).getRemainingAmount());
        assertEquals(new BigDecimal("65.00"), responses.get(0).getPercentageUsed());
        assertEquals(BudgetHealthStatus.ON_TRACK, responses.get(0).getHealthStatus());
    }

    @Test
    void getBudget_Success() {
        when(budgetRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testBudget));
        when(expenseRepository.getSpentByCategoryBetweenDates(eq(1L), eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("9500.00"));

        BudgetResponse response = budgetService.getBudget(1L);

        assertNotNull(response);
        assertEquals("Food Budget", response.getName());
        assertEquals(new BigDecimal("9500.00"), response.getSpentAmount());
        assertEquals(new BigDecimal("500.00"), response.getRemainingAmount());
        assertEquals(new BigDecimal("95.00"), response.getPercentageUsed());
        assertEquals(BudgetHealthStatus.WARNING, response.getHealthStatus());
    }

    @Test
    void getBudget_OverBudget() {
        when(budgetRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testBudget));
        when(expenseRepository.getSpentByCategoryBetweenDates(eq(1L), eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("11000.00"));

        BudgetResponse response = budgetService.getBudget(1L);

        assertNotNull(response);
        assertEquals(new BigDecimal("11000.00"), response.getSpentAmount());
        assertEquals(BigDecimal.ZERO, response.getRemainingAmount()); // Remaining should be clamped to 0
        assertEquals(new BigDecimal("110.00"), response.getPercentageUsed());
        assertEquals(BudgetHealthStatus.OVER_BUDGET, response.getHealthStatus());
    }

    @Test
    void createBudget_Success() {
        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setName("New Budget");
        request.setAmount(new BigDecimal("5000.00"));
        request.setPeriod(BudgetPeriod.MONTHLY);
        request.setCategoryId(1L);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(30));

        when(categoryRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testCategory));
        when(budgetRepository.save(any(Budget.class))).thenAnswer(i -> {
            Budget b = i.getArgument(0);
            b.setId(2L);
            return b;
        });

        BudgetResponse response = budgetService.createBudget(request);

        assertNotNull(response);
        assertEquals("New Budget", response.getName());
        verify(budgetRepository).save(any(Budget.class));
    }

    @Test
    void updateBudget_Success() {
        UpdateBudgetRequest request = new UpdateBudgetRequest();
        request.setName("Updated Budget");
        request.setAmount(new BigDecimal("15000.00"));
        request.setPeriod(BudgetPeriod.YEARLY);
        request.setCategoryId(1L);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusYears(1));

        when(budgetRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testBudget));
        when(categoryRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testCategory));
        when(budgetRepository.save(any(Budget.class))).thenReturn(testBudget);

        BudgetResponse response = budgetService.updateBudget(1L, request);

        assertNotNull(response);
        assertEquals("Updated Budget", testBudget.getName());
        assertEquals(new BigDecimal("15000.00"), testBudget.getAmount());
        verify(budgetRepository).save(testBudget);
    }

    @Test
    void deleteBudget_Success() {
        when(budgetRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testBudget));

        budgetService.deleteBudget(1L);

        verify(budgetRepository).delete(testBudget);
    }

    @Test
    void pauseBudget_Success() {
        when(budgetRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testBudget));
        when(budgetRepository.save(any(Budget.class))).thenReturn(testBudget);

        BudgetResponse response = budgetService.pauseBudget(1L);

        assertNotNull(response);
        assertEquals(BudgetStatus.PAUSED, testBudget.getStatus());
        verify(budgetRepository).save(testBudget);
    }

    @Test
    void resumeBudget_Success() {
        testBudget.setStatus(BudgetStatus.PAUSED);
        when(budgetRepository.findByIdAndUserId(1L, testUser.getId())).thenReturn(Optional.of(testBudget));
        when(budgetRepository.save(any(Budget.class))).thenReturn(testBudget);

        BudgetResponse response = budgetService.resumeBudget(1L);

        assertNotNull(response);
        assertEquals(BudgetStatus.ACTIVE, testBudget.getStatus());
        verify(budgetRepository).save(testBudget);
    }

    @Test
    void getAnalytics_Success() {
        Budget b2 = Budget.builder()
                .id(2L)
                .user(testUser)
                .name("General Budget")
                .amount(new BigDecimal("20000.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(LocalDate.now().withDayOfMonth(1))
                .endDate(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()))
                .status(BudgetStatus.ACTIVE)
                .build();

        when(budgetRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId())).thenReturn(Arrays.asList(testBudget, b2));
        
        when(expenseRepository.getSpentByCategoryBetweenDates(eq(1L), eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("5000.00")); // Food category spending (50% ON TRACK)
                
        when(expenseRepository.getSpentBetweenDates(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("19000.00")); // General spending (95% WARNING)

        BudgetAnalyticsResponse analytics = budgetService.getAnalytics();

        assertNotNull(analytics);
        assertEquals(2, analytics.getTotalBudgets());
        assertEquals(2, analytics.getActiveBudgets());
        assertEquals(new BigDecimal("30000.00"), analytics.getTotalBudgetAmount());
        assertEquals(new BigDecimal("24000.00"), analytics.getTotalSpentAmount());
        assertEquals(new BigDecimal("6000.00"), analytics.getTotalRemainingAmount());
        assertEquals(new BigDecimal("80.00"), analytics.getOverallPercentageUsed()); // 24000/30000 = 80%
        assertEquals(0, analytics.getBudgetsOverLimit());
        assertEquals(1, analytics.getBudgetsAtRisk());
    }

    @Test
    void getBudget_DataIsolation_ThrowsException() {
        // Mock that the budget does not exist for the CURRENT user
        when(budgetRepository.findByIdAndUserId(2L, testUser.getId())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> budgetService.getBudget(2L));
    }
}
