import React from 'react';
import type { SubscriptionResponse } from '../../types';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface DeleteSubscriptionConfirmationProps {
  subscription: SubscriptionResponse;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const DeleteSubscriptionConfirmation: React.FC<DeleteSubscriptionConfirmationProps> = ({
  subscription,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
          Are you sure you want to delete the subscription <strong>{subscription.name}</strong>?
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This will remove the tracking of this recurring payment of <strong>{formatCurrency(subscription.amount, currency)}</strong>. This action cannot be undone.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onConfirm} disabled={isLoading} style={{ color: 'var(--color-danger)' }}>
          {isLoading ? 'Deleting...' : 'Delete Subscription'}
        </Button>
      </div>
    </div>
  );
};
