import { Card, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DashboardSummaryResponse } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface SummaryCardsProps {
  summary: DashboardSummaryResponse;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';


  const isPositiveChange = summary.monthlyChangePercentage > 0;
  const isNegativeChange = summary.monthlyChangePercentage < 0;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      
      <Card style={{ height: '100%' }}>
        <CardContent style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 'var(--font-weight-medium)' }}>
              Total Spent
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)', marginTop: '0.75rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            {formatCurrency(summary.totalSpent, currency)}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Lifetime spending
          </div>
        </CardContent>
      </Card>

      <Card style={{ height: '100%' }}>
        <CardContent style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 'var(--font-weight-medium)' }}>
              This Month
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)', marginTop: '0.75rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            {formatCurrency(summary.thisMonthSpent, currency)}
          </div>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            color: isPositiveChange ? 'var(--color-danger)' : (isNegativeChange ? 'var(--color-success)' : 'var(--color-text-muted)'),
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {isPositiveChange ? <TrendingUp size={16} /> : (isNegativeChange ? <TrendingDown size={16} /> : <Minus size={16} />)}
            <span>
              {Math.abs(summary.monthlyChangePercentage).toFixed(1)}% {isPositiveChange ? 'more' : (isNegativeChange ? 'less' : 'same')} than last month
            </span>
          </div>
        </CardContent>
      </Card>

      <Card style={{ height: '100%' }}>
        <CardContent style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 'var(--font-weight-medium)' }}>
              Last Month
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)', marginTop: '0.75rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            {formatCurrency(summary.lastMonthSpent, currency)}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Previous month total
          </div>
        </CardContent>
      </Card>

      <Card style={{ height: '100%' }}>
        <CardContent style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 'var(--font-weight-medium)' }}>
              Average Expense
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)', marginTop: '0.75rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            {formatCurrency(summary.averageExpense, currency)}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Across {summary.transactionCount} transactions
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
