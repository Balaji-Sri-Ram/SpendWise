import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Activity } from 'lucide-react';
import type { 
  DashboardSummaryResponse, 
  BudgetAnalyticsResponse 
} from '../../types';

interface SpendingHealthProps {
  summary: DashboardSummaryResponse | null;
  budgetAnalytics: BudgetAnalyticsResponse | null;
}

export const SpendingHealth: React.FC<SpendingHealthProps> = ({ summary, budgetAnalytics }) => {
  // Calculate a simple application-derived indicator
  let score = 100;
  
  if (budgetAnalytics) {
    score -= (budgetAnalytics.budgetsOverLimit * 20);
    score -= (budgetAnalytics.budgetsAtRisk * 10);
  }

  if (summary && summary.monthlyChangePercentage > 0) {
    score -= 15;
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let statusText = 'Good';
  let statusColor = 'var(--color-success)';
  if (score < 50) {
    statusText = 'Needs Attention';
    statusColor = 'var(--color-danger)';
  } else if (score < 80) {
    statusText = 'Moderate';
    statusColor = 'var(--color-warning)';
  }

  // Sub-metrics
  const totalBudgets = budgetAnalytics?.totalBudgets || 0;
  const budgetDiscipline = totalBudgets > 0 
    ? Math.round(((totalBudgets - (budgetAnalytics?.budgetsOverLimit || 0)) / totalBudgets) * 100)
    : 100;

  const budgetAlerts = totalBudgets > 0
    ? Math.round(((totalBudgets - (budgetAnalytics?.budgetsAtRisk || 0)) / totalBudgets) * 100)
    : 100;

  if (!summary && !budgetAnalytics) {
    return (
      <Card style={{ height: '100%', borderRadius: 'var(--radius-xl)' }}>
        <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            Spending Health
          </h2>
        </CardHeader>
        <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Not enough data yet</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} style={{ color: 'var(--color-text-secondary)' }} />
          Spending Health
        </h2>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
          App-derived indicator
        </span>
      </CardHeader>
      <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: '1' }}>
              {score}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'var(--font-weight-semibold)', color: statusColor }}>
            {statusText}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Budget discipline</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{budgetDiscipline}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${budgetDiscipline}%`, backgroundColor: budgetDiscipline < 50 ? 'var(--color-danger)' : (budgetDiscipline < 80 ? 'var(--color-warning)' : 'var(--color-success)'), borderRadius: 'var(--radius-full)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Budget alerts (no risk)</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{budgetAlerts}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${budgetAlerts}%`, backgroundColor: budgetAlerts < 50 ? 'var(--color-danger)' : (budgetAlerts < 80 ? 'var(--color-warning)' : 'var(--color-success)'), borderRadius: 'var(--radius-full)' }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
