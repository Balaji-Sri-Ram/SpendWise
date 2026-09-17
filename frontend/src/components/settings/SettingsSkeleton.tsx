import React from 'react';
import { Card, CardContent } from '../ui/Card';

export const SettingsSkeleton: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ height: '32px', width: '180px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div style={{ height: '20px', width: '350px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {[1, 2, 3].map((section) => (
          <Card key={section}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ height: '24px', width: '150px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            </div>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ flex: '0 0 200px' }}>
                  <div style={{ height: '20px', width: '120px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                  <div style={{ height: '14px', width: '180px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '60px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};
