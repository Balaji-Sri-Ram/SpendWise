import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteBudgetConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  budgetName: string;
  isDeleting: boolean;
}

export const DeleteBudgetConfirmation: React.FC<DeleteBudgetConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  budgetName,
  isDeleting
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Budget">
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
          Are you sure you want to delete the budget <strong>{budgetName}</strong>?
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This action cannot be undone. Your expense records will remain untouched.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onConfirm} disabled={isDeleting} style={{ color: 'var(--color-danger)' }}>
          {isDeleting ? 'Deleting...' : 'Delete Budget'}
        </Button>
      </div>
    </Modal>
  );
};
