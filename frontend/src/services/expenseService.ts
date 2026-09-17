import { api } from '../lib/api';
import type { ExpenseResponse, CategoryResponse } from '../types';

export interface GetExpensesParams {
  categoryId?: number;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ExpenseRequest {
  amount: number;
  description: string;
  categoryId: number;
  paymentMethod: string;
  expenseDate: string;
}

export const expenseService = {
  getExpenses: (params: GetExpensesParams = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params.paymentMethod) searchParams.append('paymentMethod', params.paymentMethod);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.minAmount) searchParams.append('minAmount', params.minAmount.toString());
    if (params.maxAmount) searchParams.append('maxAmount', params.maxAmount.toString());
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    
    if (params.sort) {
      params.sort.forEach(s => searchParams.append('sort', s));
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/expenses?${queryString}` : '/expenses';
    
    return api.get<PageResponse<ExpenseResponse>>(endpoint);
  },
  
  createExpense: (data: ExpenseRequest) => 
    api.post<ExpenseResponse>('/expenses', data),
    
  updateExpense: (id: number, data: ExpenseRequest) => 
    api.put<ExpenseResponse>(`/expenses/${id}`, data),
    
  deleteExpense: (id: number) => 
    api.delete<void>(`/expenses/${id}`),
    
  getCategories: () => 
    api.get<CategoryResponse[]>('/categories')
};
