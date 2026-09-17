import React from 'react';
import type { BudgetResponse } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wallet, PieChart, Edit2, Play, Pause, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface BudgetCardProps {
  budget: BudgetResponse;
  onEdit: (budget: BudgetResponse) => void;
  onToggleStatus: (budget: BudgetResponse) => void;
  onDelete: (budget: BudgetResponse) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onToggleStatus, onDelete }) => {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';

  const getProgressColor = () => {

    switch (budget.healthStatus) {
      case 'ON_TRACK':
        return 'var(--color-success)';
      case 'WARNING':
        return 'var(--color-warning)';
      case 'OVER_BUDGET':
        return 'var(--color-danger)';
      default:
        return 'var(--color-primary)';
    }
  };

  const getStatusBadge = () => {

    if (budget.status === 'PAUSED') {
      return (
        <span style={{ 
          fontSize: 'var(--font-size-xs)', 
          fontWeight: 'var(--font-weight-medium)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: 'var(--radius-full)', 
          backgroundColor: 'var(--color-border)', 
          color: 'var(--color-text-secondary)' 
        }}>
          Paused
        </span>
      );
    }
    
    let bgColor = '';
    let color = '';
    let label = '';
    
    switch (budget.healthStatus) {
      case 'ON_TRACK':
        bgColor = 'rgba(34, 197, 94, 0.1)';
        color = 'var(--color-success)';
        label = 'On track';
        break;
      case 'WARNING':
        bgColor = 'rgba(245, 158, 11, 0.1)';
        color = 'var(--color-warning)';
        label = 'Warning';
        break;
      case 'OVER_BUDGET':
        bgColor = 'rgba(239, 68, 68, 0.1)';
        color = 'var(--color-danger)';
        label = 'Over budget';
        break;
    }
    
    return (
      <span style={{ 
        fontSize: 'var(--font-size-xs)', 
        fontWeight: 'var(--font-weight-medium)', 
        padding: '0.25rem 0.75rem', 
        borderRadius: 'var(--radius-full)', 
        backgroundColor: bgColor, 
        color: color 
      }}>
        {label}
      </span>
    );
  };

  // Clamp percentage to 100% for the visual bar
  const visualPercentage = Math.min(budget.percentageUsed, 100);

  return (
    <Card style={{ opacity: budget.status === 'PAUSED' ? 0.7 : 1 }}>
      <CardContent style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text-primary)'
            }}>
              {budget.category ? <PieChart size={20} /> : <Wallet size={20} />}
            </div>
            <div>
              <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                {budget.name}
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {budget.category ? budget.category.name : 'General Budget'} • {budget.period === 'MONTHLY' ? 'Monthly' : 'Yearly'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              {formatCurrency(budget.spentAmount, currency)}
            </span>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              of {formatCurrency(budget.amount, currency)}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {formatCurrency(budget.remainingAmount, currency)} remaining
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Progress</span>
            <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              {budget.percentageUsed}%
            </span>
          </div>
          <div style={{ 
            height: '8px', 
            width: '100%', 
            backgroundColor: 'var(--color-border)', 
            borderRadius: 'var(--radius-full)', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${visualPercentage}%`, 
              backgroundColor: getProgressColor(),
              borderRadius: 'var(--radius-full)',
              transition: 'width var(--transition-normal)'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <Button variant="outline" size="sm" onClick={() => onToggleStatus(budget)}>
            {budget.status === 'ACTIVE' ? <><Pause size={16} style={{ marginRight: '0.25rem' }} /> Pause</> : <><Play size={16} style={{ marginRight: '0.25rem' }} /> Resume</>}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(budget)}>
            <Edit2 size={16} style={{ marginRight: '0.25rem' }} /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(budget)} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
            <Trash2 size={16} style={{ marginRight: '0.25rem' }} /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
