import React, { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';
import type { BudgetAnalyticsResponse } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { Wallet } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const BudgetOverview: React.FC = () => {
  const { currency } = useSettings();
  const [analytics, setAnalytics] = useState<BudgetAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetAnalytics = async () => {
      try {
        const data = await budgetService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch budget analytics for dashboard', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetAnalytics();
  }, []);

  if (isLoading || !analytics || analytics.totalBudgets === 0) {
    return null; // Don't show anything on the dashboard if loading or no budgets exist
  }

  const visualPercentage = Math.min(analytics.overallPercentageUsed, 100);
  
  let progressColor = 'var(--color-primary)';
  if (analytics.overallPercentageUsed >= 100) {
    progressColor = 'var(--color-danger)';
  } else if (analytics.overallPercentageUsed >= 90) {
    progressColor = 'var(--color-warning)';
  } else if (analytics.overallPercentageUsed >= 70) {
    progressColor = 'var(--color-warning)'; // Warning could be softer for 70-89%
  } else {
    progressColor = 'var(--color-success)';
  }

  return (
    <Card style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>
          <Wallet size={16} />
          Budget Overview
        </h3>
        <Link to="/budgets" style={{ color: 'var(--color-primary)', fontSize: '12px', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)' }}>
          View Budgets →
        </Link>
      </CardHeader>
      <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {formatCurrency(analytics.totalSpentAmount, currency)}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                / {formatCurrency(analytics.totalBudgetAmount, currency)}
              </span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-semibold)', color: progressColor }}>
                {analytics.overallPercentageUsed}% used
              </span>
              {analytics.overallPercentageUsed > 100 && (
                <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-danger)', marginTop: '0.1rem' }}>
                  Over budget
                </span>
              )}
            </div>
          </div>

          <div>
            <div style={{ 
              height: '6px', 
              width: '100%', 
              backgroundColor: 'var(--color-border)', 
              borderRadius: 'var(--radius-full)', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                height: '100%', 
                width: `${visualPercentage}%`, 
                backgroundColor: progressColor,
                borderRadius: 'var(--radius-full)',
                transition: 'width var(--transition-normal)'
              }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {analytics.overallPercentageUsed <= 100 
                ? `${formatCurrency(analytics.totalRemainingAmount, currency)} remaining`
                : `${formatCurrency(Math.abs(analytics.totalRemainingAmount), currency)} exceeded`
              }
            </span>
            <span style={{ color: analytics.budgetsAtRisk > 0 || analytics.budgetsOverLimit > 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>
              {analytics.budgetsAtRisk + analytics.budgetsOverLimit > 0 
                ? `${analytics.budgetsAtRisk + analytics.budgetsOverLimit} budget${analytics.budgetsAtRisk + analytics.budgetsOverLimit > 1 ? 's' : ''} at risk` 
                : 'All budgets on track'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
