import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }} className={className}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: 'var(--font-size-sm)'
      }}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead style={{
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-background)'
    }}>
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return (
    <tbody style={{ backgroundColor: 'var(--color-surface)' }}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <tr 
      className={className}
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '', style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <th 
      className={className}
      style={{ 
        padding: '0.75rem 1rem', 
        color: 'var(--color-text-secondary)',
        fontWeight: 'var(--font-weight-medium)',
        whiteSpace: 'nowrap',
        ...style
      }}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <td 
      className={className}
      style={{ padding: '1rem', color: 'var(--color-text-primary)', ...style }}
    >
      {children}
    </td>
  );
}
