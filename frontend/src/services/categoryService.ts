import { api } from '../lib/api';
import type { CategoryResponse } from '../types';

export interface CategoryRequest {
  name: string;
  description?: string;
}

export const categoryService = {
  getCategories: () => 
    api.get<CategoryResponse[]>('/categories'),
    
  getCategory: (id: number) => 
    api.get<CategoryResponse>(`/categories/${id}`),
    
  createCategory: (data: CategoryRequest) => 
    api.post<CategoryResponse>('/categories', data),
    
  updateCategory: (id: number, data: CategoryRequest) => 
    api.put<CategoryResponse>(`/categories/${id}`, data),
    
  deleteCategory: (id: number) => 
    api.delete<void>(`/categories/${id}`)
};
