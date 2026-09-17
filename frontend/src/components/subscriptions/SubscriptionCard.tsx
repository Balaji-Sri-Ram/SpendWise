import React from 'react';
import type { SubscriptionResponse } from '../../types';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Calendar, CreditCard, Tag } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface SubscriptionCardProps {
  subscription: SubscriptionResponse;
  onEdit: (subscription: SubscriptionResponse) => void;
  onDelete: (subscription: SubscriptionResponse) => void;
  onToggleStatus: (subscription: SubscriptionResponse) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';
  const dateFormat = settingsCtx?.dateFormat || 'DD_MMM_YYYY';

  const isPaused = subscription.status === 'PAUSED';

  return (
    <div 
      className="card" 
      style={{ 
        padding: '1.25rem', 
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        opacity: isPaused ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            {subscription.name}
          </h3>
          {subscription.description && (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {subscription.description}
            </p>
          )}
        </div>
        <div>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '0.125rem 0.625rem', 
            borderRadius: 'var(--radius-full)', 
            fontSize: 'var(--font-size-xs)', 
            fontWeight: 'var(--font-weight-medium)',
            backgroundColor: isPaused ? 'var(--color-background)' : 'var(--color-success-bg)',
            color: isPaused ? 'var(--color-text-secondary)' : 'var(--color-success-text)'
          }}>
            {isPaused ? 'Paused' : 'Active'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <CreditCard size={16} style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }} />
          <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{formatCurrency(subscription.amount, currency)}</span>
          <span style={{ marginLeft: '0.25rem' }}>/ {subscription.billingCycle.toLowerCase()}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <Calendar size={16} style={{ marginRight: '0.5rem', color: isPaused ? 'var(--color-text-muted)' : 'var(--color-warning)' }} />
          <span>Next: <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{formatDate(subscription.nextBillingDate, dateFormat)}</span></span>
        </div>

        {subscription.category && (
          <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <Tag size={16} style={{ marginRight: '0.5rem', color: 'var(--color-danger)' }} />
            <span>{subscription.category.name}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <Button
          variant="outline" size="sm"
          onClick={() => onToggleStatus(subscription)}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          variant="outline" size="sm"
          onClick={() => onEdit(subscription)}
        >
          Edit
        </Button>
        <Button
          variant="outline" size="sm"
          style={{ color: 'var(--color-danger)' }}
          onClick={() => onDelete(subscription)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
