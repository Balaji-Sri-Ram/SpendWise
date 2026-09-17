import { Card, CardContent, CardHeader } from '../ui/Card';

function SkeletonBlock({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', style }: { width?: string, height?: string, borderRadius?: string, style?: React.CSSProperties }) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      backgroundColor: 'var(--color-border)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      ...style
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Quick Actions Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} height="48px" />)}
      </div>


      {/* Summary Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent style={{ padding: '1.5rem' }}>
              <SkeletonBlock width="80px" height="14px" />
              <div style={{ marginTop: '0.5rem' }}>
                <SkeletonBlock width="120px" height="32px" />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <SkeletonBlock width="100px" height="12px" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health & Insights Row Skeleton */}
      <div className="dashboard-grid-3" style={{ display: 'grid', gap: '1.5rem' }}>
        <Card style={{ height: '300px' }}>
          <CardHeader><SkeletonBlock width="120px" height="20px" /></CardHeader>
          <CardContent><SkeletonBlock width="100%" height="200px" /></CardContent>
        </Card>
        <Card style={{ height: '300px' }}>
          <CardHeader><SkeletonBlock width="120px" height="20px" /></CardHeader>
          <CardContent><SkeletonBlock width="100%" height="200px" /></CardContent>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ height: '142px' }}>
            <CardHeader><SkeletonBlock width="100px" height="20px" /></CardHeader>
            <CardContent><SkeletonBlock width="100%" height="60px" /></CardContent>
          </Card>
          <Card style={{ height: '142px' }}>
            <CardHeader><SkeletonBlock width="120px" height="20px" /></CardHeader>
            <CardContent><SkeletonBlock width="100%" height="60px" /></CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row Skeleton */}
      <div className="dashboard-grid-2" style={{ display: 'grid', gap: '1.5rem' }}>
        <Card style={{ height: '350px' }}>
          <CardHeader><SkeletonBlock width="150px" height="20px" /></CardHeader>
          <CardContent><SkeletonBlock width="100%" height="260px" /></CardContent>
        </Card>
        <Card style={{ height: '350px' }}>
          <CardHeader><SkeletonBlock width="150px" height="20px" /></CardHeader>
          <CardContent><SkeletonBlock width="200px" height="200px" borderRadius="50%" style={{ margin: '0 auto' }} /></CardContent>
        </Card>
      </div>

      {/* Lists Row Skeleton */}
      <div className="dashboard-grid-2" style={{ display: 'grid', gap: '1.5rem' }}>
        <Card style={{ height: '400px' }}>
          <CardHeader><SkeletonBlock width="150px" height="20px" /></CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} width="100%" height="48px" />)}
            </div>
          </CardContent>
        </Card>
        <Card style={{ height: '400px' }}>
          <CardHeader><SkeletonBlock width="150px" height="20px" /></CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} width="100%" height="40px" />)}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .dashboard-grid-2 {
          grid-template-columns: 2fr 1fr;
        }
        .dashboard-grid-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        @media (max-width: 1280px) {
          .dashboard-grid-3 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 1024px) {
          .dashboard-grid-2 {
            grid-template-columns: 1fr;
          }
          .dashboard-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
