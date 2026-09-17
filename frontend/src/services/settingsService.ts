import { api } from '../lib/api';
import type { UserSettingsResponse, UpdateUserSettingsRequest } from '../types';

export const settingsService = {
  getSettings: async (): Promise<UserSettingsResponse> => {
    return await api.get<UserSettingsResponse>('/settings');
  },
  
  updateSettings: async (data: UpdateUserSettingsRequest): Promise<UserSettingsResponse> => {
    return await api.put<UserSettingsResponse>('/settings', data);
  },
  
  resetSettings: async (): Promise<UserSettingsResponse> => {
    return await api.post<UserSettingsResponse>('/settings/reset', {});
  }
};
