import { Card, CardHeader, CardContent } from '../ui/Card';
import { Link } from 'react-router-dom';
import type { ExpenseResponse } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ShoppingBag, Coffee, Home, Zap, CreditCard } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface RecentExpensesProps {
  data: ExpenseResponse[];
}

// Simple helper to pick an icon based on category name
const getCategoryIcon = (name: string) => {

  const n = name.toLowerCase();
  if (n.includes('food') || n.includes('coffee') || n.includes('dining')) return <Coffee size={18} />;
  if (n.includes('shopping') || n.includes('groceries')) return <ShoppingBag size={18} />;
  if (n.includes('home') || n.includes('rent')) return <Home size={18} />;
  if (n.includes('utility') || n.includes('electric')) return <Zap size={18} />;
  return <CreditCard size={18} />;
};

export function RecentExpenses({ data }: RecentExpensesProps) {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';
  const dateFormat = settingsCtx?.dateFormat || 'DD_MMM_YYYY';


  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Recent Expenses</h2>
        <Link to="/expenses" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)' }}>
          View all →
        </Link>
      </CardHeader>
      
      <CardContent style={{ flexGrow: 1, padding: 0 }}>
        {data.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No recent expenses
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.slice(0, 5).map((expense, i) => (
              <div 
                key={expense.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.875rem 1.25rem',
                  borderBottom: i !== data.slice(0, 5).length - 1 ? '1px solid var(--color-border)' : 'none',
                  backgroundColor: 'transparent',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-background-accent)', 
                    color: 'var(--color-text-primary)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {getCategoryIcon(expense.category.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {expense.description}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                      {expense.category.name} • {formatDate(expense.expenseDate, dateFormat)}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                    -{formatCurrency(expense.amount, currency)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                    {expense.paymentMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
