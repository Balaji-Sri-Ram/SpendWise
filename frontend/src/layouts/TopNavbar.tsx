import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User as UserIcon, Settings as SettingsIcon, Search, Sun, Moon, ChevronDown, Monitor } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { QuickAddDropdown } from './QuickAddDropdown';

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const { settings, theme, updateSettings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };



  const changeTheme = async (newTheme: string) => {
    if (!settings) return;
    try {
      await updateSettings({ 
        currency: settings.currency,
        dateFormat: settings.dateFormat,
        theme: newTheme as any,
        emailNotifications: settings.emailNotifications,
        budgetAlerts: settings.budgetAlerts,
        subscriptionReminders: settings.subscriptionReminders,
        weeklySummary: settings.weeklySummary,
        monthlySummary: settings.monthlySummary
      });
      setIsThemeDropdownOpen(false);
    } catch (err) {
      console.error('Failed to change theme:', err);
    }
  };
  
  const getThemeIcon = () => {
    if (theme === 'LIGHT') return <Sun size={18} />;
    if (theme === 'DARK') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const getPageContext = () => {
    const path = location.pathname;
    if (path.startsWith('/expenses')) {
      return { title: 'Expenses', subtitle: "Track and understand your spending." };
    }
    if (path.startsWith('/categories')) {
      return { title: 'Categories', subtitle: "Organize your spending." };
    }
    if (path.startsWith('/subscriptions')) {
      return { title: 'Subscriptions', subtitle: "Keep recurring payments under control." };
    }
    if (path.startsWith('/budgets')) {
      return { title: 'Budgets', subtitle: "Stay ahead of your spending goals." };
    }
    if (path.startsWith('/profile')) {
      return { title: 'Profile', subtitle: "Manage your personal information." };
    }
    if (path.startsWith('/settings')) {
      return { title: 'Settings', subtitle: "Customize your SpendWise experience." };
    }
    return { title: '', subtitle: '' };
  };

  const context = getPageContext();

  return (
    <>
      <header style={{ 
        height: '72px', 
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="mobile-menu-btn"
            onClick={onMenuClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              {context.title}
            </h1>
          </div>
          {/* Mobile Title fallback */}
          <div className="mobile-only">
            <h1 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              {context.title}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Global Search / Command Button */}
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '200px',
              height: '36px',
              padding: '0 0.75rem',
              backgroundColor: 'var(--color-surface-muted)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            className="search-cmd-btn desktop-only"
            aria-label="Search or run command"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={14} />
              <span style={{ fontSize: '13px' }}>Search</span>
            </div>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-muted)'
            }}>
              Ctrl K
            </span>
          </button>
          
          <button onClick={() => setIsCommandPaletteOpen(true)} className="mobile-only" style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)' }}>
            <Search size={18} />
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 0.25rem' }} className="desktop-only" />

          {/* Theme Toggle */}
          <div style={{ position: 'relative' }} ref={themeDropdownRef}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid transparent',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              className="icon-btn"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>
            {isThemeDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '180px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.5rem'
                }}
              >
                {[
                  { value: 'LIGHT', label: 'Light', icon: <Sun size={16} /> },
                  { value: 'DARK', label: 'Dark', icon: <Moon size={16} /> },
                  { value: 'SYSTEM', label: 'System', icon: <Monitor size={16} /> }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => changeTheme(opt.value)}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      color: theme === opt.value ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: theme === opt.value ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add */}
          <div className="desktop-only">
            <QuickAddDropdown />
          </div>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Profile */}
          {user && (
            <div style={{ position: 'relative', marginLeft: '0.5rem' }} ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: 'transparent', 
                  border: '1px solid transparent',
                  padding: '0.25rem 0.5rem 0.25rem 0.25rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                className="user-profile-btn"
                aria-label="User menu"
              >
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-surface-muted)', 
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: '14px'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="desktop-only" style={{ 
                  fontSize: '13px', 
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)'
                }}>
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown className="desktop-only" size={14} color="var(--color-text-secondary)" />
              </button>

              {isDropdownOpen && (
                <div 
                  style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '240px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  zIndex: 50,
                  animation: 'dropdownFadeIn var(--transition-normal) ease-out'
                }}>
                  <div style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <span style={{ 
                      fontSize: 'var(--font-size-sm)', 
                      fontWeight: 'var(--font-weight-semibold)', 
                      color: 'var(--color-text-primary)' 
                    }}>
                      {user.name}
                    </span>
                    <span style={{ 
                      fontSize: 'var(--font-size-xs)', 
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user.email}
                    </span>
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.75rem 1rem', 
                        color: 'var(--color-text-primary)', 
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background-color var(--transition-fast)',
                        textDecoration: 'none'
                      }}
                      className="dropdown-item"
                    >
                      <UserIcon size={16} /> Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.75rem 1rem', 
                        color: 'var(--color-text-primary)', 
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background-color var(--transition-fast)',
                        textDecoration: 'none'
                      }}
                      className="dropdown-item"
                    >
                      <SettingsIcon size={16} /> Settings
                    </Link>
                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.25rem 0' }} />
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        width: '100%',
                        padding: '0.75rem 1rem', 
                        color: 'var(--color-danger)', 
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background-color var(--transition-fast)',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                      }}
                      className="dropdown-item-danger"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      <style>{`
        .search-cmd-btn:hover {
          background-color: var(--color-border);
        }
        .icon-btn:hover {
          background-color: var(--color-surface-muted);
        }
        .user-profile-btn:hover {
          background-color: var(--color-surface-muted);
        }
        .dropdown-item:hover {
          background-color: var(--color-background);
        }
        .dropdown-item-danger:hover {
          background-color: var(--color-danger-bg);
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
