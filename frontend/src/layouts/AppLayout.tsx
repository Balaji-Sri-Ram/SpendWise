import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleQuickAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      
      if (action === 'expense' && !location.pathname.startsWith('/expenses')) {
        navigate('/expenses', { state: { openAdd: true } });
      } else if (action === 'budget' && !location.pathname.startsWith('/budgets')) {
        navigate('/budgets', { state: { openAdd: true } });
      } else if (action === 'subscription' && !location.pathname.startsWith('/subscriptions')) {
        navigate('/subscriptions', { state: { openAdd: true } });
      } else if (action === 'category' && !location.pathname.startsWith('/categories')) {
        navigate('/categories', { state: { openAdd: true } });
      }
    };
    
    window.addEventListener('spendwise:quick-add', handleQuickAdd);
    return () => window.removeEventListener('spendwise:quick-add', handleQuickAdd);
  }, [location, navigate]);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(true);
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-background)' }}>
      {/* Glass Background Elements */}
      <div id="glass-env" className="glass-env"></div>
      <div className="glass-env-noise"></div>

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar" style={{ height: '100%' }}>
        <Sidebar isCollapsed={isDesktopCollapsed} onToggle={() => setIsDesktopCollapsed(!isDesktopCollapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div 
        className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-normal)'
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'all var(--transition-normal)' }}>
        <TopNavbar onMenuClick={handleMenuClick} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
