import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import type { BudgetResponse, BudgetAnalyticsResponse, CategoryResponse, CreateBudgetRequest, UpdateBudgetRequest } from '../types';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetForm } from '../components/budgets/BudgetForm';
import { BudgetEmptyState } from '../components/budgets/BudgetEmptyState';
import { BudgetSkeleton } from '../components/budgets/BudgetSkeleton';
import { DeleteBudgetConfirmation } from '../components/budgets/DeleteBudgetConfirmation';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Wallet } from 'lucide-react';

export const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [analytics, setAnalytics] = useState<BudgetAnalyticsResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetResponse | undefined>(undefined);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState<BudgetResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAdd) {
      setIsFormOpen(true);
      // Clear state to avoid reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleQuickAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'budget') {
        setIsFormOpen(true);
      }
    };
    window.addEventListener('spendwise:quick-add', handleQuickAdd);
    return () => window.removeEventListener('spendwise:quick-add', handleQuickAdd);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [fetchedBudgets, fetchedAnalytics, fetchedCategories] = await Promise.all([
        budgetService.getBudgets(),
        budgetService.getAnalytics(),
        categoryService.getCategories()
      ]);
      setBudgets(fetchedBudgets);
      setAnalytics(fetchedAnalytics);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch budgets data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (data: CreateBudgetRequest | UpdateBudgetRequest) => {
    if (editingBudget) {
      await budgetService.updateBudget(editingBudget.id, data as UpdateBudgetRequest);
    } else {
      await budgetService.createBudget(data as CreateBudgetRequest);
    }
    fetchData(); // Refresh data to get updated analytics and budgets
  };

  const handleToggleStatus = async (budget: BudgetResponse) => {
    try {
      if (budget.status === 'ACTIVE') {
        await budgetService.pauseBudget(budget.id);
      } else {
        await budgetService.resumeBudget(budget.id);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to toggle budget status', error);
    }
  };

  const confirmDelete = (budget: BudgetResponse) => {
    setDeletingBudget(budget);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingBudget) return;
    try {
      setIsDeleting(true);
      await budgetService.deleteBudget(deletingBudget.id);
      setIsDeleteOpen(false);
      setDeletingBudget(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete budget', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openNewForm = () => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (budget: BudgetResponse) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Budgets</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', fontSize: 'var(--font-size-lg)' }}>Plan your spending and stay on track.</p>
          </div>
        </div>
        <BudgetSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Budgets</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', fontSize: 'var(--font-size-lg)' }}>Plan your spending and stay on track.</p>
        </div>
        <Button onClick={openNewForm}>
          + Add Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <BudgetEmptyState onAdd={openNewForm} />
      ) : (
        <>
          {analytics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <StatCard
                title="Total Budget"
                amount={analytics.totalBudgetAmount}
                icon={<Wallet size={20} />}
                trendLabel="Across active budgets"
              />
              <StatCard
                title="Total Spent"
                amount={analytics.totalSpentAmount}
                icon={<Wallet size={20} />}
                trendLabel={`${analytics.overallPercentageUsed}% used`}
              />
              <StatCard
                title="Remaining"
                amount={analytics.totalRemainingAmount}
                icon={<Wallet size={20} />}
                trendLabel="Available budget"
              />
              <StatCard
                title="Budgets at Risk"
                amount={analytics.budgetsAtRisk + analytics.budgetsOverLimit}
                icon={<Wallet size={20} />}
                isCurrency={false}
                trendLabel={analytics.budgetsOverLimit > 0 ? `${analytics.budgetsOverLimit} over limit` : 'Need attention'}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {budgets.map(budget => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={openEditForm}
                onToggleStatus={handleToggleStatus}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        </>
      )}

      {isFormOpen && (
        <BudgetForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateOrUpdate}
          initialData={editingBudget}
          categories={categories}
        />
      )}

      {isDeleteOpen && deletingBudget && (
        <DeleteBudgetConfirmation
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          budgetName={deletingBudget.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
