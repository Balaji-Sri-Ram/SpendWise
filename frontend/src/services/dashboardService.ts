import { api } from '../lib/api';
import type { 
  DashboardSummaryResponse, 
  MonthlySpendingResponse, 
  CategoryBreakdownResponse,
  TopCategoryResponse,
  ExpenseResponse 
} from '../types';

export const dashboardService = {
  getSummary: () => 
    api.get<DashboardSummaryResponse>('/dashboard/summary'),
    
  getMonthlySpending: (months: number = 6) => 
    api.get<MonthlySpendingResponse[]>(`/dashboard/monthly-spending?months=${months}`),
    
  getCategoryBreakdown: () => 
    api.get<CategoryBreakdownResponse[]>('/dashboard/category-breakdown'),
    
  getRecentExpenses: () => 
    api.get<ExpenseResponse[]>('/dashboard/recent-expenses'),
    
  getTopCategories: () => 
    api.get<TopCategoryResponse[]>('/dashboard/top-categories')
};
