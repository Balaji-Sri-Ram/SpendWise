import { Card, CardHeader, CardContent } from '../ui/Card';
import type { TopCategoryResponse } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface TopCategoriesProps {
  data: TopCategoryResponse[];
}

export function TopCategories({ data }: TopCategoriesProps) {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';


  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Top Categories</h2>
      </CardHeader>
      
      <CardContent style={{ flexGrow: 1, padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        {data.length === 0 ? (
          <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No category data available
          </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.slice(0, 5).map((item, index) => (
              <div key={item.categoryName} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '24px', 
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-muted)',
                  marginRight: '0.75rem'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {item.categoryName}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {formatCurrency(item.amount, currency)}
                    </span>
                  </div>
                  
                  {/* Subtle visual indicator based on the top category (index 0) */}
                  <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${data[0].amount > 0 ? (item.amount / data[0].amount) * 100 : 0}%`, 
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
