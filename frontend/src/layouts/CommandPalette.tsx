import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  Repeat, 
  Wallet, 
  User, 
  Settings,
  Plus
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'NAVIGATION' | 'QUICK ACTIONS';
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleQuickAdd = (type: string) => {
    onClose();
    window.dispatchEvent(new CustomEvent('spendwise:quick-add', { detail: { action: type } }));
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dashboard', title: 'Dashboard', icon: <LayoutDashboard size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/dashboard') },
    { id: 'nav-expenses', title: 'Expenses', icon: <Receipt size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/expenses') },
    { id: 'nav-categories', title: 'Categories', icon: <Tags size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/categories') },
    { id: 'nav-subscriptions', title: 'Subscriptions', icon: <Repeat size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/subscriptions') },
    { id: 'nav-budgets', title: 'Budgets', icon: <Wallet size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/budgets') },
    { id: 'nav-profile', title: 'Profile', icon: <User size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/profile') },
    { id: 'nav-settings', title: 'Settings', icon: <Settings size={18} />, category: 'NAVIGATION', action: () => handleNavigate('/settings') },
    
    // Quick Actions
    { id: 'add-expense', title: 'Add Expense', icon: <Plus size={18} />, category: 'QUICK ACTIONS', action: () => handleQuickAdd('expense') },
    { id: 'add-budget', title: 'Add Budget', icon: <Plus size={18} />, category: 'QUICK ACTIONS', action: () => handleQuickAdd('budget') },
    { id: 'add-subscription', title: 'Add Subscription', icon: <Plus size={18} />, category: 'QUICK ACTIONS', action: () => handleQuickAdd('subscription') },
    { id: 'add-category', title: 'Add Category', icon: <Plus size={18} />, category: 'QUICK ACTIONS', action: () => handleQuickAdd('category') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 100,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn var(--transition-fast) ease-out'
        }}
        onClick={onClose}
      />
      <div 
        className="glass-panel"
        style={{
          position: 'fixed',
          top: '20vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '600px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          zIndex: 101,
          overflow: 'hidden',
          animation: 'paletteScaleIn var(--transition-fast) ease-out'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <Search size={20} color="var(--color-text-secondary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '0.5rem 1rem',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-primary)',
              outline: 'none'
            }}
          />
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-background)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}>
            ESC
          </div>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No results found for "{searchQuery}"
            </div>
          ) : (
            <>
              {Array.from(new Set(filteredCommands.map(c => c.category))).map(category => (
                <div key={category} style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    padding: '0.5rem 1rem',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.05em'
                  }}>
                    {category}
                  </div>
                  {filteredCommands.filter(c => c.category === category).map(cmd => {
                    const index = filteredCommands.findIndex(c => c.id === cmd.id);
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: 'none',
                          background: isSelected ? 'var(--color-background)' : 'transparent',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color var(--transition-fast)'
                        }}
                      >
                        <div style={{ 
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)' 
                        }}>
                          {cmd.icon}
                        </div>
                        <span style={{ 
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: isSelected ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
                        }}>
                          {cmd.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes paletteScaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .command-palette-anim {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
