import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { 
  SubscriptionResponse, 
  SubscriptionAnalyticsResponse, 
  CategoryResponse, 
  CreateSubscriptionRequest, 
  UpdateSubscriptionRequest 
} from '../types';
import { subscriptionService } from '../services/subscriptionService';
import { categoryService } from '../services/categoryService';
import { SubscriptionCard } from '../components/subscriptions/SubscriptionCard';
import { SubscriptionForm } from '../components/subscriptions/SubscriptionForm';
import { UpcomingRenewals } from '../components/subscriptions/UpcomingRenewals';
import { DeleteSubscriptionConfirmation } from '../components/subscriptions/DeleteSubscriptionConfirmation';
import { SubscriptionSkeleton } from '../components/subscriptions/SubscriptionSkeleton';
import { SubscriptionEmptyState } from '../components/subscriptions/SubscriptionEmptyState';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CreditCard, CalendarDays, CalendarCheck2, Repeat } from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [analytics, setAnalytics] = useState<SubscriptionAnalyticsResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionResponse | undefined>();
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<SubscriptionResponse | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAdd) {
      setIsFormModalOpen(true);
      // Clear state to avoid reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleQuickAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'subscription') {
        setIsFormModalOpen(true);
      }
    };
    window.addEventListener('spendwise:quick-add', handleQuickAdd);
    return () => window.removeEventListener('spendwise:quick-add', handleQuickAdd);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [subsData, analyticsData, categoriesData] = await Promise.all([
        subscriptionService.getSubscriptions(),
        subscriptionService.getAnalytics(),
        categoryService.getCategories(),
      ]);
      
      setSubscriptions(subsData);
      setAnalytics(analyticsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError('Unable to load subscriptions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateSubscriptionRequest) => {
    try {
      setIsSubmitting(true);
      await subscriptionService.createSubscription(data);
      await fetchData();
      setIsFormModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateSubscriptionRequest) => {
    if (!editingSubscription) return;
    try {
      setIsSubmitting(true);
      await subscriptionService.updateSubscription(editingSubscription.id, data);
      await fetchData();
      setIsFormModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!subscriptionToDelete) return;
    try {
      setIsSubmitting(true);
      await subscriptionService.deleteSubscription(subscriptionToDelete.id);
      await fetchData();
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (subscription: SubscriptionResponse) => {
    try {
      const newStatus = subscription.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await subscriptionService.updateSubscription(subscription.id, {
        name: subscription.name,
        description: subscription.description,
        amount: subscription.amount,
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
        categoryId: subscription.category?.id,
        status: newStatus,
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to toggle status');
    }
  };

  const openCreateModal = () => {
    setEditingSubscription(undefined);
    setIsFormModalOpen(true);
  };

  const openEditModal = (subscription: SubscriptionResponse) => {
    setEditingSubscription(subscription);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (subscription: SubscriptionResponse) => {
    setSubscriptionToDelete(subscription);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ paddingBottom: '2rem' }}>
        <SubscriptionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem', maxWidth: '400px', width: '100%', borderColor: 'var(--color-danger)' }}>
          <p style={{ color: 'var(--color-danger)', fontWeight: 'var(--font-weight-medium)', marginBottom: '1.5rem' }}>{error}</p>
          <Button onClick={fetchData} className="btn-secondary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        gap: '1rem',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            Subscriptions
          </h1>
          <p style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
            Keep track of your recurring payments and upcoming renewals.
          </p>
        </div>
        <Button onClick={openCreateModal} className="btn-primary">
          + Add Subscription
        </Button>
      </div>

      {analytics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <StatCard
            title="Active Subscriptions"
            amount={analytics.activeSubscriptions}
            icon={<Repeat size={20} />}
            trend={0}
            trendLabel="active services"
            isCurrency={false}
          />
          <StatCard
            title="Monthly Commitment"
            amount={analytics.monthlyCommitment}
            icon={<CalendarCheck2 size={20} />}
            trend={0}
            trendLabel="estimated"
          />
          <StatCard
            title="Yearly Commitment"
            amount={analytics.yearlyCommitment}
            icon={<CalendarDays size={20} />}
            trend={0}
            trendLabel="estimated"
          />
          <StatCard
            title="Total Services"
            amount={subscriptions.length}
            icon={<CreditCard size={20} />}
            trend={0}
            trendLabel="tracked items"
            isCurrency={false}
          />
        </div>
      )}

      {subscriptions.length === 0 ? (
        <SubscriptionEmptyState onAdd={openCreateModal} />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '2 1 500px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                All Subscriptions
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subscriptions.map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <UpcomingRenewals subscriptions={subscriptions} />
          </div>
        </div>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
      >
        <SubscriptionForm
          initialData={editingSubscription}
          categories={categories}
          onSubmit={editingSubscription ? handleUpdate : handleCreate}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Subscription"
      >
        {subscriptionToDelete && (
          <DeleteSubscriptionConfirmation
            subscription={subscriptionToDelete}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
            isLoading={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
};
