import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateAuthUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('spendwise_access_token');
      
      if (token) {
        try {
          const userData = await api.get<User>('/users/me');
          setUser(userData);
        } catch (e) {
          localStorage.removeItem('spendwise_access_token');
          localStorage.removeItem('spendwise_refresh_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      localStorage.setItem('spendwise_access_token', response.accessToken);
      localStorage.setItem('spendwise_refresh_token', response.refreshToken);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      localStorage.setItem('spendwise_access_token', response.accessToken);
      localStorage.setItem('spendwise_refresh_token', response.refreshToken);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('spendwise_refresh_token');
    if (refreshToken) {
      api.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    localStorage.removeItem('spendwise_access_token');
    localStorage.removeItem('spendwise_refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateAuthUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
