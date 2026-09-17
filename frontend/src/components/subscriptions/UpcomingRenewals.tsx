import React from 'react';
import type { SubscriptionResponse } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { Calendar } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface UpcomingRenewalsProps {
  subscriptions: SubscriptionResponse[];
}

export const UpcomingRenewals: React.FC<UpcomingRenewalsProps> = ({ subscriptions }) => {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';

  // Filter active subscriptions and sort by upcoming date
  const upcoming = subscriptions
    .filter(sub => sub.status === 'ACTIVE')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5); // Show top 5

  if (upcoming.length === 0) {
    return (
      <Card style={{ height: '100%' }}>
        <CardHeader>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            Upcoming Renewals
          </h3>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center' }}>
            <Calendar size={40} style={{ color: 'var(--color-border)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              No active subscriptions scheduled for renewal.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
          Upcoming Renewals
        </h3>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {upcoming.map((sub) => {
            const billingDate = new Date(sub.nextBillingDate);
            billingDate.setHours(0, 0, 0, 0);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            const diffTime = billingDate.getTime() - todayDate.getTime();
            const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let statusText = '';
            let statusColor = '';
            let statusBg = '';
            
            if (daysUntil < 0) {
              statusText = 'Overdue';
              statusColor = 'var(--color-danger-text)';
              statusBg = 'var(--color-danger-bg)';
            } else if (daysUntil === 0) {
              statusText = 'Renews today';
              statusColor = 'var(--color-danger-text)'; // use danger as rose replacement
              statusBg = 'var(--color-danger-bg)';
            } else if (daysUntil <= 3) {
              statusText = `Renews in ${daysUntil} days`;
              statusColor = 'var(--color-warning-text)';
              statusBg = 'var(--color-warning-bg)';
            } else {
              statusText = `Renews in ${daysUntil} days`;
              statusColor = 'var(--color-text-secondary)';
              statusBg = 'var(--color-background)';
            }

            return (
              <div 
                key={sub.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ marginTop: '0.375rem', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></div>
                  <div>
                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{sub.name}</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>{formatCurrency(sub.amount, currency)} / {sub.billingCycle.toLowerCase()}</p>
                  </div>
                </div>
                <div>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: 'var(--font-size-xs)', 
                    fontWeight: 'var(--font-weight-medium)',
                    color: statusColor,
                    backgroundColor: statusBg
                  }}>
                    {statusText}
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
