import { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { budgetService } from '../services/budgetService';
import { subscriptionService } from '../services/subscriptionService';
import type { BudgetResponse, SubscriptionResponse } from '../types';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  date: Date;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
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

  const fetchNotifications = async () => {
    if (hasFetched) return;
    setIsLoading(true);
    setHasError(false);

    try {
      const [budgets, subscriptions] = await Promise.all([
        budgetService.getBudgets(),
        subscriptionService.getSubscriptions()
      ]);

      const newNotifications: NotificationItem[] = [];

      // Process Budgets
      budgets.forEach((budget: BudgetResponse) => {
        if (budget.status !== 'ACTIVE') return;

        if (budget.percentageUsed >= 100) {
          newNotifications.push({
            id: `budget-over-${budget.id}`,
            title: `${budget.name} budget is full`,
            description: `₹${budget.spentAmount.toLocaleString()} of ₹${budget.amount.toLocaleString()} used`,
            type: 'warning',
            date: new Date() // In a real app, might want the date it crossed the threshold
          });
        } else if (budget.percentageUsed >= 80) {
          newNotifications.push({
            id: `budget-warning-${budget.id}`,
            title: `${budget.name} budget is almost full`,
            description: `₹${budget.spentAmount.toLocaleString()} of ₹${budget.amount.toLocaleString()} used`,
            type: 'info',
            date: new Date()
          });
        }
      });

      // Process Subscriptions
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      subscriptions.forEach((sub: SubscriptionResponse) => {
        if (sub.status !== 'ACTIVE') return;

        const nextBilling = new Date(sub.nextBillingDate);
        if (nextBilling > now && nextBilling <= nextWeek) {
          const formattedDate = nextBilling.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
          newNotifications.push({
            id: `sub-renewal-${sub.id}`,
            title: `Upcoming subscription`,
            description: `${sub.name} renews on ${formattedDate}`,
            type: 'info',
            date: nextBilling
          });
        }
      });

      // Sort by date (most recent first conceptually, though dates here are synthesized or future)
      // For now we just keep the order (budgets then subscriptions)
      
      setNotifications(newNotifications);
      setHasFetched(true);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const hasUnread = notifications.length > 0; // Simple approximation since we don't have a read status API yet

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        style={{ 
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-primary)',
          position: 'relative',
          transition: 'background-color var(--transition-fast)'
        }}
        className="notification-btn"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {hasUnread && !hasFetched && ( // Only show red dot if we haven't opened it yet (simulating unread)
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--color-danger)',
            borderRadius: '50%',
            border: '2px solid var(--color-surface)'
          }} />
        )}
      </button>

      {isOpen && (
        <div 

          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '320px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            zIndex: 50,
            animation: 'dropdownFadeIn var(--transition-fast) ease-out'
          }}
        >
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-base)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              Notifications
            </h3>
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Loading...
              </div>
            ) : hasError ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Notifications are temporarily unavailable.
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ 
                padding: '3rem 1rem', 
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}>
                <CheckCircle2 size={32} color="var(--color-success)" style={{ opacity: 0.8 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                    You're all caught up.
                  </p>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    No new notifications.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {notifications.map((notif, index) => (
                  <div 
                    key={notif.id}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      borderBottom: index < notifications.length - 1 ? '1px solid var(--color-border)' : 'none',
                      backgroundColor: 'var(--color-surface)',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    className="notification-item"
                  >
                    <div style={{ 
                      marginTop: '0.25rem',
                      color: notif.type === 'warning' ? 'var(--color-danger)' : 'var(--color-primary)' 
                    }}>
                      {notif.type === 'warning' ? <AlertCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        margin: '0 0 0.25rem 0', 
                        fontSize: 'var(--font-size-sm)', 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}>
                        {notif.title}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        fontSize: 'var(--font-size-sm)', 
                        color: 'var(--color-text-secondary)'
                      }}>
                        {notif.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        .notification-btn:hover {
          background-color: var(--color-background);
        }
        .notification-item:hover {
          background-color: var(--color-background) !important;
        }
      `}</style>
    </div>
  );
}
