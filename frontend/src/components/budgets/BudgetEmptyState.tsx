import React from 'react';
import { Button } from '../ui/Button';
import { Wallet } from 'lucide-react';
import { Card } from '../ui/Card';

interface BudgetEmptyStateProps {
  onAdd: () => void;
}

export const BudgetEmptyState: React.FC<BudgetEmptyStateProps> = ({ onAdd }) => {
  return (
    <Card style={{ padding: '4rem 2rem', textAlign: 'center', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '64px', 
        height: '64px', 
        borderRadius: '50%', 
        backgroundColor: 'var(--color-background)', 
        margin: '0 auto 1.5rem auto' 
      }}>
        <Wallet size={32} style={{ color: 'var(--color-accent)' }} />
      </div>
      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
        No budgets yet
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 2rem auto', lineHeight: 'var(--line-height-relaxed)' }}>
        Create your first budget and take control of your monthly spending.
      </p>
      <Button onClick={onAdd} className="btn-primary">
        + Create Budget
      </Button>
    </Card>
  );
};
