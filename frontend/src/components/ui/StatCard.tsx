import React from 'react';
import { Card, CardContent } from './Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface StatCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  icon,
  trend,
  trendLabel,
  isCurrency = true,
}) => {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';

  return (
    <Card style={{ height: '100%' }}>
      <CardContent style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            {title}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '32px', 
            height: '32px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)'
          }}>
            {icon}
          </div>
        </div>
        
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginTop: 'auto' }}>
          {isCurrency ? formatCurrency(amount, currency) : amount}
        </div>
        
        {trendLabel && (
          <div style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {trend !== undefined && trend !== 0 && (
              <span style={{ color: trend > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 'var(--font-weight-medium)' }}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
            {trend !== undefined && trend !== 0 && " "}
            {trendLabel}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
