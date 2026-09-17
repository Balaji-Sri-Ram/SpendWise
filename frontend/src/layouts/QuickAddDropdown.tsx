import { useState, useRef, useEffect } from 'react';
import { Plus, Receipt, Wallet, Repeat, Tags } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function QuickAddDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: string) => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('spendwise:quick-add', { detail: { action } }));
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        variant="primary"
        style={{ 
          borderRadius: 'var(--radius-full)', 
          padding: '0.35rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--font-size-sm)',
          transition: 'all var(--transition-normal)',
          boxShadow: 'var(--shadow-sm)'
        }}
        className="quick-add-btn"
      >
        <Plus size={16} />
        <span className="desktop-only">Add</span>
      </Button>

      {isOpen && (
        <div 

          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '200px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            zIndex: 50,
            animation: 'dropdownFadeIn var(--transition-fast) ease-out'
          }}
        >
          <div style={{ padding: '0.5rem' }}>
            <button 
              onClick={() => handleAction('expense')}
              className="dropdown-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <Receipt size={16} color="var(--color-primary)" /> Expense
            </button>
            <button 
              onClick={() => handleAction('budget')}
              className="dropdown-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <Wallet size={16} color="var(--color-success)" /> Budget
            </button>
            <button 
              onClick={() => handleAction('subscription')}
              className="dropdown-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <Repeat size={16} color="var(--color-warning)" /> Subscription
            </button>
            <button 
              onClick={() => handleAction('category')}
              className="dropdown-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <Tags size={16} color="var(--color-danger)" /> Category
            </button>
          </div>
        </div>
      )}
      <style>{`
        .dropdown-item:hover {
          background-color: var(--color-background) !important;
        }
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .quick-add-btn, .dropdown-item {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
