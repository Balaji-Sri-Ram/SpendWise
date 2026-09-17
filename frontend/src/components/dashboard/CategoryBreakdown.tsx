import { Card, CardHeader, CardContent } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import type { CategoryBreakdownResponse } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface CategoryBreakdownProps {
  data: CategoryBreakdownResponse[];
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f43f5e', // rose
];

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';
  const navigate = useNavigate();


  if (!data || data.length === 0) {
    return (
      <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}>
        <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Category Breakdown</h2>
        </CardHeader>
        <CardContent style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-text-muted)' }}>No categories yet</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Category Breakdown</h2>
      </CardHeader>
      <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '0.75rem 1.25rem 1.25rem 1.25rem' }}>
        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                nameKey="categoryName"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => formatCurrency(value as number, currency)}
                contentStyle={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.slice(0, 5).map((item, index) => (
            <div 
              key={item.categoryId} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: item.categoryId ? 'pointer' : 'default' }}
              onClick={() => {
                if (item.categoryId) {
                  navigate(`/expenses?categoryId=${item.categoryId}`);
                }
              }}
              title={item.categoryId ? 'View expenses in this category' : undefined}
              onMouseOver={(e) => {
                if (item.categoryId) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                  e.currentTarget.style.borderRadius = 'var(--radius-sm)';
                }
              }}
              onMouseOut={(e) => {
                if (item.categoryId) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{item.categoryName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  {formatCurrency(item.amount, currency)}
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', width: '3ch', textAlign: 'right' }}>
                  {Math.round(item.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
