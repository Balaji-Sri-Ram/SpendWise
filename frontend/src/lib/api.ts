const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('spendwise_access_token');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new ApiError(0, 'Unable to connect to SpendWise. Make sure the backend is running.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      localStorage.removeItem('spendwise_access_token');
      localStorage.removeItem('spendwise_refresh_token');
      localStorage.removeItem('spendwise_user');
      window.dispatchEvent(new Event('unauthorized'));
      throw new ApiError(401, errorData.message || 'Your session has expired. Please sign in again.');
    }
    
    throw new ApiError(response.status, errorData.message || 'Something went wrong. Please try again.');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data: any, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    
  put: <T>(endpoint: string, data: any, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
    
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
};
