import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Wallet } from 'lucide-react';
import type { BudgetResponse } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface BudgetHealthProps {
  budgets: BudgetResponse[];
}

export const BudgetHealth: React.FC<BudgetHealthProps> = ({ budgets }) => {
  const { currency } = useSettings();

  if (!budgets || budgets.length === 0) {
    return (
      <Card style={{ height: '100%', borderRadius: 'var(--radius-xl)' }}>
        <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            Budget Health
          </h2>
        </CardHeader>
        <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No active budgets</div>
        </CardContent>
      </Card>
    );
  }

  // Display top 4 budgets (sorted by highest percentage used)
  const sortedBudgets = [...budgets].sort((a, b) => b.percentageUsed - a.percentageUsed).slice(0, 4);

  return (
    <Card style={{ height: '100%', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wallet size={16} style={{ color: 'var(--color-text-secondary)' }} />
          Budget Health
        </h2>
      </CardHeader>
      <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sortedBudgets.map((budget) => {
            const visualPercentage = Math.min(budget.percentageUsed, 100);
            const isOverBudget = budget.percentageUsed > 100;
            const isAtRisk = budget.percentageUsed >= 90 && !isOverBudget;
            
            let progressColor = 'var(--color-primary)';
            if (isOverBudget) progressColor = 'var(--color-danger)';
            else if (isAtRisk) progressColor = 'var(--color-warning)';
            else if (budget.percentageUsed >= 75) progressColor = 'var(--color-warning)'; // softer warning
            else progressColor = 'var(--color-success)';

            return (
              <div key={budget.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                    {budget.name}
                  </span>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {formatCurrency(budget.spentAmount, currency)}
                    </span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {' / '}{formatCurrency(budget.amount, currency)}
                    </span>
                  </div>
                </div>
                
                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.25rem' }}>
                  <div style={{ height: '100%', width: `${visualPercentage}%`, backgroundColor: progressColor, borderRadius: 'var(--radius-full)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: isOverBudget ? 'var(--color-danger)' : 'var(--color-text-secondary)', fontWeight: isOverBudget ? 'var(--font-weight-medium)' : 'normal' }}>
                    {budget.percentageUsed}% used {isOverBudget && '• Over budget'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
