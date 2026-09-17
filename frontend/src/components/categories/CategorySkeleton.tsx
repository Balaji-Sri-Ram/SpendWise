import { Card, CardContent } from '../ui/Card';

export function CategorySkeleton() {
  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          height: '24px', 
          backgroundColor: 'var(--color-border)', 
          borderRadius: 'var(--radius-sm)', 
          width: '60%', 
          marginBottom: '0.75rem',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} />
        
        <div style={{ 
          height: '16px', 
          backgroundColor: 'var(--color-border)', 
          borderRadius: 'var(--radius-sm)', 
          width: '90%', 
          marginBottom: '0.5rem',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} />
        <div style={{ 
          height: '16px', 
          backgroundColor: 'var(--color-border)', 
          borderRadius: 'var(--radius-sm)', 
          width: '75%', 
          marginBottom: '1.5rem',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ 
            height: '14px', 
            backgroundColor: 'var(--color-border)', 
            borderRadius: 'var(--radius-sm)', 
            width: '30%',
            animation: 'pulse 1.5s infinite ease-in-out'
          }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ 
              height: '28px', 
              width: '40px',
              backgroundColor: 'var(--color-border)', 
              borderRadius: 'var(--radius-sm)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            <div style={{ 
              height: '28px', 
              width: '50px',
              backgroundColor: 'var(--color-border)', 
              borderRadius: 'var(--radius-sm)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
          </div>
        </div>
      </CardContent>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </Card>
  );
}
