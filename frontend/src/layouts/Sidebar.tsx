import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Repeat, Settings, User, Wallet } from 'lucide-react';

export function Sidebar({ className = '', isCollapsed = false, onToggle }: { className?: string, isCollapsed?: boolean, onToggle?: () => void }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: PieChart },
    { name: 'Budgets', path: '/budgets', icon: Wallet },
    { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
  ];

  const bottomNavItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderNav = (items: typeof navItems) => (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <li key={item.name}>
            <Link
              to={item.path}
              title={isCollapsed ? item.name : undefined}

              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? '0' : '0.75rem',
                padding: isCollapsed ? '0.75rem' : '0.65rem 1rem',
                minHeight: '44px',
                borderRadius: 'var(--radius-lg)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-surface-muted)' : 'transparent',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface-muted)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; } }}
            >
              <item.icon size={18} style={{ minWidth: 18, transition: 'all var(--transition-fast)' }} />
              <span style={{ 
                opacity: isCollapsed ? 0 : 1, 
                width: isCollapsed ? 0 : 'auto', 
                visibility: isCollapsed ? 'hidden' : 'visible',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}>
                {item.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        padding: isCollapsed ? '1.5rem 0.5rem' : '1.5rem 1rem',
        width: isCollapsed ? '80px' : '250px',
        transition: 'width var(--transition-normal), padding var(--transition-normal)',
        position: 'relative'
      }}
    >
      {onToggle && (
        <button 
          onClick={onToggle}
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: '-12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            fontSize: '10px',
            color: 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isCollapsed ? '›' : '‹'}
        </button>
      )}
      <div style={{ 
        padding: isCollapsed ? '0 0 2.5rem 0' : '0 0.5rem 2.5rem 0.5rem', 
        textAlign: isCollapsed ? 'center' : 'left',
        fontWeight: 'var(--font-weight-bold)', 
        fontSize: isCollapsed ? 'var(--font-size-lg)' : 'var(--font-size-xl)',
        transition: 'all var(--transition-normal)',
        display: 'flex',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        alignItems: 'center'
      }}>
        <Link to="/dashboard" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)', display: 'flex', alignItems: 'center', gap: '0.75rem' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}>
          <div style={{ width: 32, height: 32, backgroundColor: 'var(--color-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, backgroundColor: 'white', borderRadius: '50%', border: '3px solid var(--color-primary)', boxShadow: '0 0 0 2px white' }}></div>
          </div>
          {!isCollapsed && <span>SpendWise</span>}
        </Link>
      </div>
      
      <nav style={{ flex: 1 }}>
        {renderNav(navItems)}
      </nav>

      <nav>
        {renderNav(bottomNavItems)}
      </nav>
    </aside>
  );
}
