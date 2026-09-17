import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Lightbulb, AlertTriangle, TrendingDown, Clock, Info } from 'lucide-react';
import type { 
  DashboardSummaryResponse, 
  BudgetAnalyticsResponse,
  SubscriptionResponse 
} from '../../types';

interface SpendingInsightsProps {
  summary: DashboardSummaryResponse | null;
  budgetAnalytics: BudgetAnalyticsResponse | null;
  subscriptions: SubscriptionResponse[];
}

export const SpendingInsights: React.FC<SpendingInsightsProps> = ({ summary, budgetAnalytics, subscriptions }) => {
  const insights = [];

  // Insight 1: Top Category
  if (summary && summary.topCategory && summary.topCategory !== 'Unknown') {
    insights.push({
      id: 'top-category',
      icon: <Info size={16} className="text-primary" style={{ color: 'var(--color-primary)' }} />,
      text: `Your highest spending category is ${summary.topCategory}.`,
      type: 'info'
    });
  }

  // Insight 2: Budgets Over Limit
  if (budgetAnalytics && budgetAnalytics.budgetsOverLimit > 0) {
    insights.push({
      id: 'budget-over',
      icon: <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} />,
      text: `You have ${budgetAnalytics.budgetsOverLimit} budget${budgetAnalytics.budgetsOverLimit > 1 ? 's' : ''} over limit.`,
      type: 'danger'
    });
  }

  // Insight 3: Budgets At Risk
  if (budgetAnalytics && budgetAnalytics.budgetsAtRisk > 0) {
    insights.push({
      id: 'budget-risk',
      icon: <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />,
      text: `You have ${budgetAnalytics.budgetsAtRisk} budget${budgetAnalytics.budgetsAtRisk > 1 ? 's' : ''} at risk of exceeding the limit.`,
      type: 'warning'
    });
  }

  // Insight 4: Positive Trend
  if (summary && summary.monthlyChangePercentage < 0) {
    insights.push({
      id: 'positive-trend',
      icon: <TrendingDown size={16} style={{ color: 'var(--color-success)' }} />,
      text: `Great job! Your spending is ${Math.abs(summary.monthlyChangePercentage).toFixed(1)}% lower than the previous period.`,
      type: 'success'
    });
  }

  // Insight 5: Upcoming Subscriptions (Next 7 days)
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  const upcomingSubs = subscriptions.filter(sub => {
    if (sub.status !== 'ACTIVE') return false;
    const nextBilling = new Date(sub.nextBillingDate);
    return nextBilling >= now && nextBilling <= nextWeek;
  });

  if (upcomingSubs.length > 0) {
    insights.push({
      id: 'upcoming-subs',
      icon: <Clock size={16} style={{ color: 'var(--color-primary)' }} />,
      text: `You have ${upcomingSubs.length} upcoming subscription renewal${upcomingSubs.length > 1 ? 's' : ''} in the next 7 days.`,
      type: 'info'
    });
  }

  return (
    <Card style={{ height: '100%', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={16} style={{ color: 'var(--color-text-secondary)' }} />
          Spending Insights
        </h2>
      </CardHeader>
      <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        {insights.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '2rem 0' }}>
            Add more expenses to unlock spending insights.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem', 
                  padding: '0.75rem', 
                  backgroundColor: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-md)' 
                }}
              >
                <div style={{ marginTop: '0.125rem' }}>
                  {insight.icon}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
                  {insight.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
