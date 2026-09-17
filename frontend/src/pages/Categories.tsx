import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CategoryCard } from '../components/categories/CategoryCard';
import { CategoryForm } from '../components/categories/CategoryForm';
import { DeleteCategoryConfirmation } from '../components/categories/DeleteCategoryConfirmation';
import { CategorySkeleton } from '../components/categories/CategorySkeleton';
import { CategoryEmptyState } from '../components/categories/CategoryEmptyState';
import { categoryService } from '../services/categoryService';
import type { CategoryResponse } from '../types';

export function Categories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAdd) {
      setIsAddModalOpen(true);
      // Clear state to avoid reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleQuickAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'category') {
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('spendwise:quick-add', handleQuickAdd);
    return () => window.removeEventListener('spendwise:quick-add', handleQuickAdd);
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError('Unable to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchCategories();
  };

  const handleEditSuccess = () => {
    setCategoryToEdit(null);
    fetchCategories();
  };

  const handleDeleteSuccess = () => {
    setCategoryToDelete(null);
    fetchCategories();
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Categories</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', fontSize: 'var(--font-size-lg)' }}>Organize your spending and understand where your money goes.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Category
        </Button>
      </div>

      {error ? (
        <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>
          <Button onClick={() => fetchCategories()}>Try Again</Button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {isLoading ? (
            <>
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </>
          ) : categories.length === 0 ? (
            <CategoryEmptyState onAddCategory={() => setIsAddModalOpen(true)} />
          ) : (
            categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onEdit={setCategoryToEdit} 
                onDelete={() => setCategoryToDelete(category)} 
              />
            ))
          )}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Category">
        <CategoryForm onSubmitSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!categoryToEdit} onClose={() => setCategoryToEdit(null)} title="Edit Category">
        {categoryToEdit && (
          <CategoryForm 
            initialData={categoryToEdit} 
            onSubmitSuccess={handleEditSuccess} 
            onCancel={() => setCategoryToEdit(null)} 
          />
        )}
      </Modal>

      <Modal isOpen={!!categoryToDelete} onClose={() => setCategoryToDelete(null)} title="Delete Category">
        {categoryToDelete && (
          <DeleteCategoryConfirmation 
            categoryId={categoryToDelete.id}
            categoryName={categoryToDelete.name}
            onSuccess={handleDeleteSuccess} 
            onCancel={() => setCategoryToDelete(null)} 
          />
        )}
      </Modal>
    </div>
  );
}
