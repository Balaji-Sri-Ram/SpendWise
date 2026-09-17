import React from 'react';
import { Card, CardContent } from '../ui/Card';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ height: '32px', width: '150px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div style={{ height: '20px', width: '300px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>

      <Card style={{ marginBottom: '2rem' }}>
        <CardContent style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-border)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '24px', width: '200px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            <div style={{ height: '16px', width: '150px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ height: '20px', width: '150px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </div>
        <CardContent style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1, 2].map((i) => (
              <div key={i}>
                <div style={{ height: '14px', width: '80px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                <div style={{ height: '36px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ height: '20px', width: '180px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </div>
        <CardContent style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ height: '14px', width: '120px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            <div style={{ height: '36px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};
