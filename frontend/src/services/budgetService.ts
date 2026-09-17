import { api } from '../lib/api';
import type { 
  BudgetResponse, 
  BudgetAnalyticsResponse, 
  CreateBudgetRequest, 
  UpdateBudgetRequest 
} from '../types';

export const budgetService = {
  getBudgets: async (): Promise<BudgetResponse[]> => {
    return await api.get<BudgetResponse[]>('/budgets');
  },

  getBudget: async (id: number): Promise<BudgetResponse> => {
    return await api.get<BudgetResponse>(`/budgets/${id}`);
  },

  getAnalytics: async (): Promise<BudgetAnalyticsResponse> => {
    return await api.get<BudgetAnalyticsResponse>('/budgets/analytics');
  },

  createBudget: async (data: CreateBudgetRequest): Promise<BudgetResponse> => {
    return await api.post<BudgetResponse>('/budgets', data);
  },

  updateBudget: async (id: number, data: UpdateBudgetRequest): Promise<BudgetResponse> => {
    return await api.put<BudgetResponse>(`/budgets/${id}`, data);
  },

  deleteBudget: async (id: number): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  pauseBudget: async (id: number): Promise<BudgetResponse> => {
    return await api.patch<BudgetResponse>(`/budgets/${id}/pause`);
  },

  resumeBudget: async (id: number): Promise<BudgetResponse> => {
    return await api.patch<BudgetResponse>(`/budgets/${id}/resume`);
  }
};
