import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wallet } from 'lucide-react';

export function DashboardEmptyState() {
  return (
    <Card style={{ marginTop: '2rem', border: '1px dashed var(--color-border)', backgroundColor: 'transparent', boxShadow: 'none' }}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '-48px' }} />
        <Wallet size={32} color="var(--color-primary)" style={{ marginBottom: '1.5rem', zIndex: 1 }} />
        
        <h2 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', marginBottom: '0.75rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Welcome to SpendWise
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: '2.5rem', fontSize: '15px', lineHeight: '1.5' }}>
          Start tracking your expenses to understand your spending patterns.
        </p>
        
        <Button onClick={() => {
          const event = new CustomEvent('spendwise:quick-add', { detail: { action: 'expense' } });
          window.dispatchEvent(event);
        }} style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 1.5rem' }}>
          + Add your first expense
        </Button>
      </CardContent>
    </Card>
  );
}
