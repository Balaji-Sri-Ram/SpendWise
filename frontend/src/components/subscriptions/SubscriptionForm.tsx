import React, { useState, useEffect } from 'react';
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest, SubscriptionResponse, CategoryResponse } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface SubscriptionFormProps {
  initialData?: SubscriptionResponse;
  categories: CategoryResponse[];
  onSubmit: (data: CreateSubscriptionRequest | UpdateSubscriptionRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    name: '',
    description: '',
    amount: 0,
    billingCycle: 'MONTHLY',
    nextBillingDate: '',
    categoryId: undefined,
    status: 'ACTIVE',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        amount: initialData.amount,
        billingCycle: initialData.billingCycle,
        nextBillingDate: initialData.nextBillingDate,
        categoryId: initialData.category?.id,
        status: initialData.status,
      });
    } else {
      // Set default next billing date to today if creating new
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, nextBillingDate: today }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' 
        ? parseFloat(value) 
        : name === 'categoryId' 
          ? (value ? parseInt(value) : undefined) 
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Subscription name is required');
      return;
    }

    if (formData.amount <= 0 || isNaN(formData.amount)) {
      setError('Amount must be greater than zero');
      return;
    }

    if (!formData.nextBillingDate) {
      setError('Next billing date is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save subscription');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <Input
        label="Subscription Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Netflix"
        required
      />

      <Input
        label="Description (Optional)"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="e.g., Premium Plan"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount || ''}
          onChange={handleChange}
          required
        />

        <Select
          label="Billing Cycle"
          name="billingCycle"
          value={formData.billingCycle}
          onChange={handleChange}
          options={[
            { value: 'WEEKLY', label: 'Weekly' },
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'QUARTERLY', label: 'Quarterly' },
            { value: 'YEARLY', label: 'Yearly' },
          ]}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Next Billing Date"
          name="nextBillingDate"
          type="date"
          value={formData.nextBillingDate}
          onChange={handleChange}
          required
        />

        <Select
          label="Category (Optional)"
          name="categoryId"
          value={formData.categoryId?.toString() || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select a category...' },
            ...categories.map((c) => ({
              value: c.id.toString(),
              label: c.name,
            })),
          ]}
        />
      </div>

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: 'ACTIVE', label: 'Active' },
          { value: 'PAUSED', label: 'Paused' },
        ]}
        required
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Subscription' : 'Add Subscription'}
        </Button>
      </div>
    </form>
  );
};
