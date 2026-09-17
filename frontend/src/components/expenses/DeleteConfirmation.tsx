import { useState } from 'react';
import { Button } from '../ui/Button';
import { expenseService } from '../../services/expenseService';

interface DeleteConfirmationProps {
  expenseId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ expenseId, onSuccess, onCancel }: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await expenseService.deleteExpense(expenseId);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        Are you sure you want to delete this expense? This action cannot be undone and will permanently remove this transaction from your records.
      </p>
      
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button 
          type="button" 
          isLoading={isDeleting} 
          onClick={handleDelete}
          style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
