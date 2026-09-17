import { api } from '../lib/api';
import type {
  SubscriptionResponse,
  SubscriptionAnalyticsResponse,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '../types';

export const subscriptionService = {
  getSubscriptions: async (): Promise<SubscriptionResponse[]> => {
    return await api.get<SubscriptionResponse[]>('/subscriptions');
  },

  getSubscriptionById: async (id: number): Promise<SubscriptionResponse> => {
    return await api.get<SubscriptionResponse>(`/subscriptions/${id}`);
  },

  createSubscription: async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
    return await api.post<SubscriptionResponse>('/subscriptions', data);
  },

  updateSubscription: async (id: number, data: UpdateSubscriptionRequest): Promise<SubscriptionResponse> => {
    return await api.put<SubscriptionResponse>(`/subscriptions/${id}`, data);
  },

  deleteSubscription: async (id: number): Promise<void> => {
    await api.delete(`/subscriptions/${id}`);
  },

  getAnalytics: async (): Promise<SubscriptionAnalyticsResponse> => {
    return await api.get<SubscriptionAnalyticsResponse>('/subscriptions/analytics');
  },
};
