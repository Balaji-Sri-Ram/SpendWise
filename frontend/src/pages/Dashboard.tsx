import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import type { 
  DashboardSummaryResponse, 
  MonthlySpendingResponse, 
  CategoryBreakdownResponse, 
  ExpenseResponse, 
  TopCategoryResponse,
  BudgetResponse,
  BudgetAnalyticsResponse,
  SubscriptionResponse
} from '../types';
import { budgetService } from '../services/budgetService';
import { subscriptionService } from '../services/subscriptionService';

import { SummaryCards } from '../components/dashboard/SummaryCard';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { RecentExpenses } from '../components/dashboard/RecentExpenses';
import { TopCategories } from '../components/dashboard/TopCategories';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { AnalyticsPeriodSelector } from '../components/dashboard/AnalyticsPeriodSelector';
import { SpendingInsights } from '../components/dashboard/SpendingInsights';
import { SpendingHealth } from '../components/dashboard/SpendingHealth';
import { BudgetHealth } from '../components/dashboard/BudgetHealth';
import { UpcomingRenewals } from '../components/dashboard/UpcomingRenewals';
import { DashboardQuickActions } from '../components/dashboard/DashboardQuickActions';
import { Button } from '../components/ui/Button';

// Helper to get time-based greeting
const getGreeting = (name: string) => {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  
  // Try to use first name if available
  const firstName = name.split(' ')[0] || 'User';
  return `${greeting}, ${firstName}`;
};

export function Dashboard() {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpendingResponse[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownResponse[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseResponse[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategoryResponse[]>([]);
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [budgetAnalytics, setBudgetAnalytics] = useState<BudgetAnalyticsResponse | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);

  // Period selector state (default 6 months)
  const [periodMonths, setPeriodMonths] = useState<number>(6);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        summaryData,
        monthlyData,
        categoryData,
        recentData,
        topCatData,
        budgetsData,
        budgetAnalyticData,
        subsData
      ] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getMonthlySpending(periodMonths),
        dashboardService.getCategoryBreakdown(),
        dashboardService.getRecentExpenses(),
        dashboardService.getTopCategories(),
        budgetService.getBudgets(),
        budgetService.getAnalytics(),
        subscriptionService.getSubscriptions()
      ]);

      setSummary(summaryData);
      setMonthlySpending(monthlyData);
      setCategoryBreakdown(categoryData);
      setRecentExpenses(recentData);
      setTopCategories(topCatData);
      setBudgets(budgetsData);
      setBudgetAnalytics(budgetAnalyticData);
      setSubscriptions(subsData);
    } catch (err: any) {
      setError('Unable to load your dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [periodMonths]);

  if (isLoading) {
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            Loading Dashboard...
          </h1>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1rem', color: 'var(--color-danger)' }}>
          {error}
        </h2>
        <Button onClick={fetchDashboardData} style={{ minWidth: '150px' }}>
          Try Again
        </Button>
      </div>
    );
  }

  // Determine if it's an empty state
  // We can consider it empty if summary.transactionCount === 0 or if all totals are 0
  const isDashboardEmpty = !summary || summary.transactionCount === 0;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            {getGreeting(user?.name || '')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontSize: '15px' }}>
            Here's your spending overview.
          </p>
        </div>
        <AnalyticsPeriodSelector 
          value={periodMonths} 
          onChange={(val) => setPeriodMonths(val)} 
        />
      </div>

      {isDashboardEmpty ? (
        <DashboardEmptyState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <DashboardQuickActions />

          <div style={{ marginBottom: '1.5rem' }}>
            {summary && <SummaryCards summary={summary} />}
          </div>
          
          {/* Health & Insights Row */}
          <div className="dashboard-grid-3" style={{ display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <SpendingHealth summary={summary} budgetAnalytics={budgetAnalytics} />
            <BudgetHealth budgets={budgets} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <SpendingInsights summary={summary} budgetAnalytics={budgetAnalytics} subscriptions={subscriptions} />
               <UpcomingRenewals subscriptions={subscriptions} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="dashboard-grid-2" style={{ display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <SpendingChart data={monthlySpending} />
            </div>
            <div>
              <CategoryBreakdown data={categoryBreakdown} />
            </div>
          </div>
          
          {/* Lists Row */}
          <div className="dashboard-grid-2" style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <RecentExpenses data={recentExpenses} />
            </div>
            <div>
              <TopCategories data={topCategories} />
            </div>
          </div>
        </div>
      )}
      <style>{`
        .dashboard-grid-2 {
          grid-template-columns: 2fr 1fr;
        }
        .dashboard-grid-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        @media (max-width: 1280px) {
          .dashboard-grid-3 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 1024px) {
          .dashboard-grid-2 {
            grid-template-columns: 1fr;
          }
          .dashboard-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
