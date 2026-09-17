import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { BudgetResponse, CreateBudgetRequest, UpdateBudgetRequest, CategoryResponse, BudgetPeriod } from '../../types';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: BudgetResponse;
  categories: CategoryResponse[];
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<BudgetPeriod>('MONTHLY');
  const [categoryId, setCategoryId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name);
      setAmount(initialData.amount.toString());
      setPeriod(initialData.period);
      setCategoryId(initialData.category ? initialData.category.id.toString() : 'all');
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setError(null);
    } else if (isOpen) {
      // Default dates for new budget (current month)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setName('');
      setAmount('');
      setPeriod('MONTHLY');
      setCategoryId('');
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
      setError(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a valid positive number');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('Start and end dates are required');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const requestData: CreateBudgetRequest | UpdateBudgetRequest = {
        name: name.trim(),
        amount: parsedAmount,
        period,
        categoryId: categoryId && categoryId !== 'all' ? parseInt(categoryId, 10) : undefined,
        startDate,
        endDate
      };
      
      await onSubmit(requestData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories (General Budget)' },
    ...categories.map(c => ({ value: c.id.toString(), label: c.name }))
  ];

  const periodOptions = [
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Budget' : 'Create Budget'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}

        <Input
          label="Budget Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries Budget"
          required
        />
        
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categoryOptions}
          />
          
          <Select
            label="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as BudgetPeriod)}
            options={periodOptions}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
