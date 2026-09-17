import React from 'react';
import { Card, CardContent } from '../ui/Card';

export const SubscriptionSkeleton: React.FC = () => {
  const skeletonStyle = {
    backgroundColor: 'var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    opacity: 0.7,
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ ...skeletonStyle, height: '32px', width: '200px', marginBottom: '8px' }}></div>
          <div style={{ ...skeletonStyle, height: '20px', width: '300px' }}></div>
        </div>
        <div style={{ ...skeletonStyle, height: '40px', width: '150px', borderRadius: 'var(--radius-md)' }}></div>
      </div>

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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Main List Skeleton */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ ...skeletonStyle, height: '24px', width: '25%' }}></div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={`card-${i}`} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '50%' }}>
                    <div style={{ ...skeletonStyle, height: '20px', width: '75%', marginBottom: '8px' }}></div>
                    <div style={{ ...skeletonStyle, height: '16px', width: '50%' }}></div>
                  </div>
                  <div style={{ ...skeletonStyle, height: '20px', width: '64px', borderRadius: 'var(--radius-full)' }}></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ ...skeletonStyle, height: '16px', width: '75%' }}></div>
                  <div style={{ ...skeletonStyle, height: '16px', width: '75%' }}></div>
                  <div style={{ ...skeletonStyle, height: '16px', width: '50%', gridColumn: 'span 2' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ ...skeletonStyle, height: '32px', width: '64px', borderRadius: 'var(--radius-md)' }}></div>
                  <div style={{ ...skeletonStyle, height: '32px', width: '64px', borderRadius: 'var(--radius-md)' }}></div>
                  <div style={{ ...skeletonStyle, height: '32px', width: '64px', borderRadius: 'var(--radius-md)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div style={{ flex: '1 1 300px' }}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ ...skeletonStyle, height: '24px', width: '50%', marginBottom: '1.5rem' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={`renewal-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem' }}>
                    <div style={{ width: '50%' }}>
                      <div style={{ ...skeletonStyle, height: '16px', width: '100%', marginBottom: '4px' }}></div>
                      <div style={{ ...skeletonStyle, height: '12px', width: '66%' }}></div>
                    </div>
                    <div style={{ ...skeletonStyle, height: '24px', width: '80px', borderRadius: 'var(--radius-sm)' }}></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
