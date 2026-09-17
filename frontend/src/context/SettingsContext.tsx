import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserSettingsResponse, CurrencyPreference, DateFormatPreference, ThemePreference, UpdateUserSettingsRequest } from '../types';
import { settingsService } from '../services/settingsService';
import { useAuth } from '../hooks/useAuth';

interface SettingsContextType {
  settings: UserSettingsResponse | null;
  isLoading: boolean;
  error: string | null;
  currency: CurrencyPreference;
  dateFormat: DateFormatPreference;
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark' | 'glass';
  refreshSettings: () => Promise<void>;
  updateSettings: (data: UpdateUserSettingsRequest) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Unable to load settings. We couldn\'t retrieve your preferences.');
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const updateSettings = async (data: UpdateUserSettingsRequest) => {
    const updated = await settingsService.updateSettings(data);
    setSettings(updated);
  };

  const resetSettings = async () => {
    const reset = await settingsService.resetSettings();
    setSettings(reset);
  };

  // Provide sensible defaults if not loaded yet
  const currency = settings?.currency || 'INR';
  const dateFormat = settings?.dateFormat || 'DD_MMM_YYYY';
  const theme = settings?.theme || 'LIGHT';
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'glass'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (themeValue: ThemePreference) => {
      if (themeValue === 'SYSTEM') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolved = isDark ? 'dark' : 'light';
        root.dataset.theme = resolved;
        setResolvedTheme(resolved);
      } else {
        const resolved = themeValue.toLowerCase() as 'light' | 'dark' | 'glass';
        root.dataset.theme = resolved;
        setResolvedTheme(resolved);
      }
    };
    
    applyTheme(theme);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'SYSTEM') {
        applyTheme('SYSTEM');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      isLoading, 
      error,
      currency,
      dateFormat,
      theme,
      resolvedTheme,
      refreshSettings, 
      updateSettings, 
      resetSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
