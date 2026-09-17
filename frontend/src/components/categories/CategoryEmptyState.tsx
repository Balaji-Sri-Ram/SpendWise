import { Button } from '../ui/Button';

interface CategoryEmptyStateProps {
  onAddCategory: () => void;
}

export function CategoryEmptyState({ onAddCategory }: CategoryEmptyStateProps) {
  return (
    <div style={{ 
      padding: '5rem 2rem', 
      textAlign: 'center', 
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gridColumn: '1 / -1'
    }}>
      <div style={{ 
        width: '64px', 
        height: '64px', 
        borderRadius: '50%', 
        backgroundColor: 'var(--color-background)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        color: 'var(--color-text-muted)'
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </div>
      
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
        No categories yet
      </h3>
      
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '400px', lineHeight: '1.5' }}>
        Categories help you organize your spending and understand exactly where your money goes every month.
      </p>
      
      <Button onClick={onAddCategory}>
        Create your first category
      </Button>
    </div>
  );
}
