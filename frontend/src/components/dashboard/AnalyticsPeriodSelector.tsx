import React from 'react';
import { Calendar } from 'lucide-react';

interface AnalyticsPeriodSelectorProps {
  value: number;
  onChange: (months: number) => void;
}

export const AnalyticsPeriodSelector: React.FC<AnalyticsPeriodSelectorProps> = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          appearance: 'none',
          padding: '0.5rem 2rem 0.5rem 2.25rem',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
          fontSize: '14px',
          fontWeight: 'var(--font-weight-medium)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-fast)',
          outline: 'none'
        }}
      >
        <option value={7} disabled>7 Days</option>
        <option value={1} disabled>30 Days</option>
        <option value={3}>3 Months</option>
        <option value={6}>6 Months</option>
        <option value={12}>1 Year</option>
      </select>
      
      <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-secondary)', display: 'flex' }}>
        <Calendar size={16} />
      </div>
      
      <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-secondary)', display: 'flex', fontSize: '10px' }}>
        ▼
      </div>
    </div>
  );
};
