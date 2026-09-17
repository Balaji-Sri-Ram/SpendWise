import { api } from '../lib/api';
import type { User } from '../types';

export const profileService = {
  getCurrentUser: async (): Promise<User> => {
    return await api.get<User>('/users/me');
  },
  updateProfile: async (data: { name: string; email: string }): Promise<User> => {
    return await api.put<User>('/users/me', data);
  }
};
