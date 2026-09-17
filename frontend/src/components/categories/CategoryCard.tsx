import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import type { CategoryResponse } from '../../types';

interface CategoryCardProps {
  category: CategoryResponse;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const formattedDate = category.createdAt 
    ? new Date(category.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s', cursor: 'default' }}>
      <CardContent style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
          {category.name}
        </h3>
        
        <p style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-text-secondary)',
          marginBottom: '1.5rem',
          flex: 1,
          lineHeight: '1.5'
        }}>
          {category.description || 'No description provided.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {formattedDate ? `Created ${formattedDate}` : ''}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="ghost" size="sm" onClick={() => onEdit(category)} style={{ color: 'var(--color-accent)', padding: '0.25rem 0.5rem' }}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(category.id)} style={{ color: 'var(--color-danger)', padding: '0.25rem 0.5rem' }}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
