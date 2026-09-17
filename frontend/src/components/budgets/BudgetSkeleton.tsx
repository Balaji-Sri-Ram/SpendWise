import React from 'react';
import { Card, CardContent } from '../ui/Card';

export const BudgetSkeleton: React.FC = () => {
  const skeletonStyle = {
    backgroundColor: 'var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    opacity: 0.7,
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Analytics Skeletons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={`analytics-${i}`}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ ...skeletonStyle, height: '16px', width: '50%', marginBottom: '16px' }}></div>
              <div style={{ ...skeletonStyle, height: '32px', width: '75%' }}></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ ...skeletonStyle, height: '24px', width: '25%' }}></div>
        <div style={{ ...skeletonStyle, height: '40px', width: '150px', borderRadius: 'var(--radius-md)' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3].map((i) => (
          <Card key={`budget-${i}`}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ ...skeletonStyle, height: '40px', width: '40px', borderRadius: 'var(--radius-md)' }}></div>
                  <div>
                    <div style={{ ...skeletonStyle, height: '20px', width: '120px', marginBottom: '8px' }}></div>
                    <div style={{ ...skeletonStyle, height: '14px', width: '80px' }}></div>
                  </div>
                </div>
                <div style={{ ...skeletonStyle, height: '24px', width: '60px', borderRadius: 'var(--radius-full)' }}></div>
              </div>
              <div style={{ ...skeletonStyle, height: '24px', width: '100px', marginBottom: '0.5rem' }}></div>
              <div style={{ ...skeletonStyle, height: '14px', width: '150px', marginBottom: '1.5rem' }}></div>
              
              <div style={{ ...skeletonStyle, height: '8px', width: '100%', borderRadius: 'var(--radius-full)', marginBottom: '0.5rem' }}></div>
              <div style={{ ...skeletonStyle, height: '14px', width: '40%' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ ...skeletonStyle, height: '32px', width: '64px', borderRadius: 'var(--radius-md)' }}></div>
                <div style={{ ...skeletonStyle, height: '32px', width: '64px', borderRadius: 'var(--radius-md)' }}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
