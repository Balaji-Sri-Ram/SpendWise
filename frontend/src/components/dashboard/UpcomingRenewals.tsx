import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { RefreshCw } from 'lucide-react';
import type { SubscriptionResponse } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useSettings } from '../../context/SettingsContext';

interface UpcomingRenewalsProps {
  subscriptions: SubscriptionResponse[];
}

export const UpcomingRenewals: React.FC<UpcomingRenewalsProps> = ({ subscriptions }) => {
  const { currency, dateFormat } = useSettings();

  const upcomingSubs = [...subscriptions]
    .filter(sub => sub.status === 'ACTIVE')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 3); // Show top 3 nearest

  return (
    <Card style={{ height: '100%', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} style={{ color: 'var(--color-text-secondary)' }} />
          Upcoming Renewals
        </h2>
      </CardHeader>
      <CardContent style={{ padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        {upcomingSubs.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '1rem 0' }}>
            No upcoming renewals
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingSubs.map((sub) => (
              <div 
                key={sub.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                    {sub.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                    {formatDate(sub.nextBillingDate, dateFormat)}
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {formatCurrency(sub.amount, currency)}
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => {
                const event = new CustomEvent('spendwise:quick-add', { detail: { action: 'subscription' } });
                window.dispatchEvent(event);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textAlign: 'left',
                marginTop: '0.5rem',
                padding: '0'
              }}
            >
              + Add Subscription
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
