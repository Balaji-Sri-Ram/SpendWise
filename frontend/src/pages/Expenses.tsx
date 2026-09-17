import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { DeleteConfirmation } from '../components/expenses/DeleteConfirmation';
import { expenseService } from '../services/expenseService';
import type { ExpenseResponse, CategoryResponse } from '../types';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
export function Expenses() {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';
  const dateFormat = settingsCtx?.dateFormat || 'DD_MMM_YYYY';


  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseResponse | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAdd) {
      setIsAddModalOpen(true);
      // Clear state to avoid reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleQuickAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'expense') {
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('spendwise:quick-add', handleQuickAdd);
    return () => window.removeEventListener('spendwise:quick-add', handleQuickAdd);
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await expenseService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories');
    }
  };

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await expenseService.getExpenses({
        page,
        size: 10,
        categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
        paymentMethod: paymentMethod || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });
      setExpenses(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError('Failed to load expenses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, categoryId, paymentMethod, startDate, endDate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFilterReset = () => {

    setCategoryId('');
    setPaymentMethod('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const handleAddSuccess = () => {

    setIsAddModalOpen(false);
    fetchExpenses();
  };

  const handleEditSuccess = () => {

    setExpenseToEdit(null);
    fetchExpenses();
  };

  const handleDeleteSuccess = () => {

    setExpenseToDelete(null);
    fetchExpenses();
  };

  const paymentOptions = [
    { label: 'Credit Card', value: 'CREDIT_CARD' },
    { label: 'Debit Card', value: 'DEBIT_CARD' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
    { label: 'UPI', value: 'UPI' }
  ];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Expenses</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', fontSize: 'var(--font-size-lg)' }}>Track and manage your spending</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Expense
        </Button>
      </div>

      <Card style={{ marginBottom: '2rem' }}>
        <CardContent style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <Select 
                label="Category" 
                value={categoryId} 
                onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
                options={categories.map(c => ({ label: c.name, value: c.id }))}
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <Select 
                label="Payment Method" 
                value={paymentMethod} 
                onChange={(e) => { setPaymentMethod(e.target.value); setPage(0); }}
                options={paymentOptions}
              />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <Input 
                label="From Date" 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }} 
              />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <Input 
                label="To Date" 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }} 
              />
            </div>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <Button variant="outline" onClick={handleFilterReset}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}>Recent Expenses</h2>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Showing {expenses.length > 0 ? page * 10 + 1 : 0}–{Math.min((page + 1) * 10, totalElements)} of {totalElements} expenses
          </div>
        </div>

        {error ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>
            <Button onClick={() => fetchExpenses()}>Retry</Button>
          </div>
        ) : isLoading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.5rem' }}>No expenses yet</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Start tracking your spending by adding your first expense.</p>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Expense</Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map(expense => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.expenseDate, dateFormat)}</TableCell>
                    <TableCell style={{ fontWeight: 'var(--font-weight-medium)' }}>{expense.description}</TableCell>
                    <TableCell>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 'var(--radius-full)', 
                        backgroundColor: 'var(--color-background)',
                        fontSize: 'var(--font-size-xs)'
                      }}>
                        {expense.category.name}
                      </span>
                    </TableCell>
                    <TableCell>{expense.paymentMethod.replace('_', ' ')}</TableCell>
                    <TableCell style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(expense.amount, currency)}</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Button variant="ghost" size="sm" onClick={() => setExpenseToEdit(expense)} style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setExpenseToDelete(expense.id)} style={{ color: 'var(--color-danger)' }}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(0, p - 1))} 
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Expense">
        <ExpenseForm onSubmitSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!expenseToEdit} onClose={() => setExpenseToEdit(null)} title="Edit Expense">
        {expenseToEdit && (
          <ExpenseForm 
            initialData={expenseToEdit} 
            onSubmitSuccess={handleEditSuccess} 
            onCancel={() => setExpenseToEdit(null)} 
          />
        )}
      </Modal>

      <Modal isOpen={!!expenseToDelete} onClose={() => setExpenseToDelete(null)} title="Delete Expense">
        {expenseToDelete && (
          <DeleteConfirmation 
            expenseId={expenseToDelete} 
            onSuccess={handleDeleteSuccess} 
            onCancel={() => setExpenseToDelete(null)} 
          />
        )}
      </Modal>
    </div>
  );
}
