import { useState } from 'react';
import { Button } from '../ui/Button';
import { categoryService } from '../../services/categoryService';

interface DeleteCategoryConfirmationProps {
  categoryId: number;
  categoryName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeleteCategoryConfirmation({ categoryId, categoryName, onSuccess, onCancel }: DeleteCategoryConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await categoryService.deleteCategory(categoryId);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category. It might be in use by existing expenses.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        Are you sure you want to delete the category <strong>"{categoryName}"</strong>? This action cannot be undone.
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
          Delete Category
        </Button>
      </div>
    </div>
  );
}
