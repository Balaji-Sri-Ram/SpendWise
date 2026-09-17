package com.spendwise.repository;

import com.spendwise.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal getTotalSpent(@Param("userId") Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate >= :startDate AND e.expenseDate <= :endDate")
    BigDecimal getSpentBetweenDates(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.category.id = :categoryId AND e.expenseDate >= :startDate AND e.expenseDate <= :endDate")
    BigDecimal getSpentByCategoryBetweenDates(@Param("userId") Long userId, @Param("categoryId") Long categoryId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    long countByUserId(Long userId);

    @Query("SELECT e.category.id, e.category.name, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId GROUP BY e.category.id, e.category.name ORDER BY SUM(e.amount) DESC")
    List<Object[]> getCategoryBreakdown(@Param("userId") Long userId);

    @Query("SELECT EXTRACT(YEAR FROM e.expenseDate), EXTRACT(MONTH FROM e.expenseDate), SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate >= :startDate GROUP BY EXTRACT(YEAR FROM e.expenseDate), EXTRACT(MONTH FROM e.expenseDate) ORDER BY EXTRACT(YEAR FROM e.expenseDate) DESC, EXTRACT(MONTH FROM e.expenseDate) DESC")
    List<Object[]> getMonthlySpending(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    Page<Expense> findByUserIdOrderByExpenseDateDesc(Long userId, Pageable pageable);

}
