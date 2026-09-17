import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { expenseService } from '../../services/expenseService';
import type { CategoryResponse, ExpenseResponse } from '../../types';

interface ExpenseFormProps {
  initialData?: ExpenseResponse;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ExpenseForm({ initialData, onSubmitSuccess, onCancel }: ExpenseFormProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.category.id?.toString() || '');
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || 'CREDIT_CARD');
  
  // Format date to YYYY-MM-DD for the input type="date"
  const defaultDate = initialData?.expenseDate || new Date().toISOString().split('T')[0];
  const [expenseDate, setExpenseDate] = useState(defaultDate);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    expenseService.getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setIsLoadingCategories(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = {
        amount: parseFloat(amount),
        description,
        categoryId: parseInt(categoryId, 10),
        paymentMethod,
        expenseDate
      };

      if (initialData) {
        await expenseService.updateExpense(initialData.id, data);
      } else {
        await expenseService.createExpense(data);
      }
      
      onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong while saving the expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    { label: 'Credit Card', value: 'CREDIT_CARD' },
    { label: 'Debit Card', value: 'DEBIT_CARD' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
    { label: 'UPI', value: 'UPI' }
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <Input 
            label="Amount" 
            type="number" 
            step="0.01"
            min="0.01"
            required 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0.00"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input 
            label="Date" 
            type="date" 
            required 
            value={expenseDate} 
            onChange={(e) => setExpenseDate(e.target.value)} 
          />
        </div>
      </div>

      <Input 
        label="Description" 
        type="text" 
        required 
        maxLength={255}
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="What did you spend on?"
      />

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <Select 
            label="Category" 
            required
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map(c => ({ label: c.name, value: c.id }))}
            disabled={isLoadingCategories}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Select 
            label="Payment Method" 
            required
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={paymentOptions}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
