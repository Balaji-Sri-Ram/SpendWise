import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { categoryService } from '../../services/categoryService';
import type { CategoryResponse } from '../../types';

interface CategoryFormProps {
  initialData?: CategoryResponse;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmitSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Category name is required');
      return;
    }
    if (trimmedName.length > 50) {
      setError('Category name must be less than 50 characters');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const data = {
        name: trimmedName,
        description: description.trim() || undefined
      };

      if (initialData) {
        await categoryService.updateCategory(initialData.id, data);
      } else {
        await categoryService.createCategory(data);
      }
      
      onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong while saving the category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          {error}
        </div>
      )}
      
      <Input 
        label="Name" 
        type="text" 
        required 
        maxLength={50}
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="e.g. Groceries"
        autoFocus
      />

      <Input 
        label="Description (Optional)" 
        type="text" 
        maxLength={255}
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Brief description of this category"
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
