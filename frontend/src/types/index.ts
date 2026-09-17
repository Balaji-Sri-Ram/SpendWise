export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface ExpenseResponse {
  id: number;
  amount: number;
  description: string;
  category: CategoryResponse;
  paymentMethod: string;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummaryResponse {
  totalSpent: number;
  thisMonthSpent: number;
  lastMonthSpent: number;
  monthlyChangePercentage: number;
  transactionCount: number;
  averageExpense: number;
  topCategory: string;
}

export interface MonthlySpendingResponse {
  month: string;
  amount: number;
}

export interface CategoryBreakdownResponse {
  categoryId: number;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface TopCategoryResponse {
  categoryName: string;
  amount: number;
}

export type BillingCycle = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED';

export interface SubscriptionResponse {
  id: number;
  name: string;
  description?: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  category?: CategoryResponse;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionAnalyticsResponse {
  activeSubscriptions: number;
  monthlyCommitment: number;
  yearlyCommitment: number;
}

export interface CreateSubscriptionRequest {
  name: string;
  description?: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  categoryId?: number;
  status: SubscriptionStatus;
}

export interface UpdateSubscriptionRequest extends CreateSubscriptionRequest {}

export type BudgetPeriod = 'MONTHLY' | 'YEARLY';

export type BudgetStatus = 'ACTIVE' | 'PAUSED';

export type BudgetHealthStatus = 'ON_TRACK' | 'WARNING' | 'OVER_BUDGET';

export interface BudgetResponse {
  id: number;
  name: string;
  amount: number;
  period: BudgetPeriod;
  category?: CategoryResponse;
  startDate: string;
  endDate: string;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  healthStatus: BudgetHealthStatus;
}

export interface BudgetAnalyticsResponse {
  totalBudgets: number;
  activeBudgets: number;
  totalBudgetAmount: number;
  totalSpentAmount: number;
  totalRemainingAmount: number;
  overallPercentageUsed: number;
  budgetsOverLimit: number;
  budgetsAtRisk: number;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetRequest extends CreateBudgetRequest {}

export type CurrencyPreference = 'INR' | 'USD' | 'EUR' | 'GBP';
export type DateFormatPreference = 'DD_MMM_YYYY' | 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'YYYY_MM_DD';
export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';
export type FontStylePreference = 'MODERN' | 'CLASSIC';

export interface UserSettingsResponse {
  id: number;
  currency: CurrencyPreference;
  dateFormat: DateFormatPreference;
  theme: ThemePreference;
  fontStyle: FontStylePreference;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  subscriptionReminders: boolean;
  weeklySummary: boolean;
  monthlySummary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsRequest {
  currency: CurrencyPreference;
  dateFormat: DateFormatPreference;
  theme: ThemePreference;
  fontStyle: FontStylePreference;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  subscriptionReminders: boolean;
  weeklySummary: boolean;
  monthlySummary: boolean;
}
