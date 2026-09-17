import React, { useState, useEffect } from 'react';
import { useSettings }     from '../context/SettingsContext';
import { useToast }        from '../context/ToastContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button }          from '../components/ui/Button';
import { Select }          from '../components/ui/Select';
import { Toggle }          from '../components/ui/Toggle';
import { SettingsSkeleton } from '../components/settings/SettingsSkeleton';
import { Modal }           from '../components/ui/Modal';
import type {
  UpdateUserSettingsRequest,
  CurrencyPreference,
  DateFormatPreference,
  ThemePreference,
} from '../types';
import { ShieldAlert, Sun, Moon, Monitor } from 'lucide-react';

/* ── Theme option config ────────────────────────────────────────── */
const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  desc:  string;
  icon:  React.ReactNode;
}[] = [
  { value: 'LIGHT',  label: 'Light',  desc: 'Professional', icon: <Sun      size={22} /> },
  { value: 'DARK',   label: 'Dark',   desc: 'Focused',      icon: <Moon     size={22} /> },
  { value: 'SYSTEM', label: 'System', desc: 'Follow OS',    icon: <Monitor  size={22} /> },
];

export const Settings: React.FC = () => {
  const { settings, isLoading, updateSettings, resetSettings } = useSettings();
  const { showToast } = useToast();

  const [formData,         setFormData]         = useState<UpdateUserSettingsRequest | null>(null);
  const [isSaving,         setIsSaving]         = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting,      setIsResetting]      = useState(false);

  /* Hydrate form from settings */
  useEffect(() => {
    if (settings) {
      setFormData({
        currency:              settings.currency,
        dateFormat:            settings.dateFormat,
        theme:                 settings.theme,
        emailNotifications:    settings.emailNotifications,
        budgetAlerts:          settings.budgetAlerts,
        subscriptionReminders: settings.subscriptionReminders,
        weeklySummary:         settings.weeklySummary,
        monthlySummary:        settings.monthlySummary,
      });
    }
  }, [settings]);

  /* Live preview — apply theme immediately when selector is clicked */
  useEffect(() => {
    if (!formData?.theme) return;
    const root = document.documentElement;
    if (formData.theme === 'SYSTEM') {
      root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      root.dataset.theme = formData.theme.toLowerCase();
    }
    return () => {
      /* Revert to persisted theme on unmount (if user didn't save) */
      if (settings?.theme) {
        if (settings.theme === 'SYSTEM') {
          root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          root.dataset.theme = settings.theme.toLowerCase();
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.theme]);

  if (isLoading || !formData) return <SettingsSkeleton />;

  const isDirty =
    formData.currency              !== settings?.currency              ||
    formData.dateFormat            !== settings?.dateFormat            ||
    formData.theme                 !== settings?.theme                 ||
    formData.emailNotifications    !== settings?.emailNotifications    ||
    formData.budgetAlerts          !== settings?.budgetAlerts          ||
    formData.subscriptionReminders !== settings?.subscriptionReminders ||
    formData.weeklySummary         !== settings?.weeklySummary         ||
    formData.monthlySummary        !== settings?.monthlySummary;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings(formData);
      showToast('Settings saved successfully', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Unable to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetSettings();
      setIsResetModalOpen(false);
      showToast('Preferences reset to defaults', 'success');
    } catch {
      showToast('Unable to reset settings.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>

      {/* Page title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
          Manage your SpendWise experience
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>

        {/* ── PREFERENCES ──────────────────────────────────────── */}
        <Card>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Preferences
            </h3>
          </div>
          <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Currency */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                Currency
              </label>
              <Select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value as CurrencyPreference })}
                options={[
                  { label: '₹  INR — Indian Rupee',     value: 'INR' },
                  { label: '$  USD — US Dollar',         value: 'USD' },
                  { label: '€  EUR — Euro',              value: 'EUR' },
                  { label: '£  GBP — British Pound',     value: 'GBP' },
                ]}
              />
            </div>

            {/* Date format */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                Date format
              </label>
              <Select
                value={formData.dateFormat}
                onChange={e => setFormData({ ...formData, dateFormat: e.target.value as DateFormatPreference })}
                options={[
                  { label: '12 Aug, 2026',  value: 'DD_MMM_YYYY' },
                  { label: '12/08/2026',    value: 'DD_MM_YYYY'  },
                  { label: '08/12/2026',    value: 'MM_DD_YYYY'  },
                  { label: '2026-08-12',    value: 'YYYY_MM_DD'  },
                ]}
              />
            </div>

            {/* Appearance selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                Appearance
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.875rem' }}>
                {THEME_OPTIONS.map(option => {
                  const isSelected = formData.theme === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: option.value })}
                      style={{
                        display:         'flex',
                        flexDirection:   'column',
                        alignItems:      'center',
                        justifyContent:  'center',
                        gap:             '0.5rem',
                        padding:         '1.25rem 0.75rem',
                        border:          `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius:    'var(--radius-xl)',
                        backgroundColor: isSelected ? 'var(--color-surface-muted)' : 'var(--color-surface)',
                        cursor:          'pointer',
                        transition:      'all var(--transition-fast)',
                        position:        'relative',
                        boxShadow:       isSelected 
                          ? `0 0 0 1px var(--color-primary), 0 4px 16px rgba(124,58,237,0.15)`
                          : 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                          (e.currentTarget as HTMLElement).style.transform   = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = '';
                          (e.currentTarget as HTMLElement).style.transform   = '';
                        }
                      }}
                    >
                      {/* Check indicator */}
                      {isSelected && (
                        <div
                          style={{
                            position:        'absolute',
                            top:             '0.5rem',
                            right:           '0.5rem',
                            width:           '18px',
                            height:          '18px',
                            borderRadius:    '50%',
                            backgroundColor: 'var(--color-primary)',
                            display:         'flex',
                            alignItems:      'center',
                            justifyContent:  'center',
                            boxShadow:       '0 2px 6px rgba(124,58,237,0.35)',
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}

                      {/* Icon */}
                      <span
                        style={{
                          color: 'var(--color-text-secondary)',
                          opacity: 0.80,
                        }}
                      >
                        {option.icon}
                      </span>

                      <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                        {option.label}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {option.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── NOTIFICATIONS ─────────────────────────────────────── */}
        <Card>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Notifications
            </h3>
          </div>
          <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { key: 'emailNotifications',    label: 'Email notifications',    sub: 'Receive account-related notification emails.' },
              { key: 'budgetAlerts',          label: 'Budget alerts',          sub: 'Get notified when spending approaches or exceeds a budget.' },
              { key: 'subscriptionReminders', label: 'Subscription reminders', sub: 'Get reminders about upcoming subscription renewals.' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{item.sub}</div>
                </div>
                <Toggle
                  checked={formData[item.key as keyof UpdateUserSettingsRequest] as boolean}
                  onChange={checked => setFormData({ ...formData, [item.key]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── REPORTS ───────────────────────────────────────────── */}
        <Card>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Reports
            </h3>
          </div>
          <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { key: 'weeklySummary',  label: 'Weekly spending summary'  },
              { key: 'monthlySummary', label: 'Monthly spending summary' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>{item.label}</span>
                <Toggle
                  checked={formData[item.key as keyof UpdateUserSettingsRequest] as boolean}
                  onChange={checked => setFormData({ ...formData, [item.key]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── DANGER ZONE ───────────────────────────────────────── */}
        <Card>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Danger Zone
            </h3>
          </div>
          <CardContent style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>Reset preferences</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Reset all settings to their default values.</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={() => setIsResetModalOpen(true)}
              >
                Reset Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        style={{
          marginTop:       '2rem',
          padding:         '1rem 1.5rem',
          backgroundColor: 'var(--color-surface)',
          border:          '1px solid var(--color-border)',
          borderRadius:    'var(--radius-xl)',
          boxShadow:       'var(--shadow-sm)',
          position:        'sticky',
          bottom:          '1.5rem',
          display:         'flex',
          justifyContent:  'flex-end',
          alignItems:      'center',
          gap:             '1rem',
          zIndex:          10,
        }}
      >
        {isDirty && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Unsaved changes
          </span>
        )}
        <Button onClick={handleSave} disabled={!isDirty || isSaving} isLoading={isSaving}>
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {/* ── Reset confirmation modal ─────────────────────────────── */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset preferences?"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-warning)', marginBottom: '0.875rem' }}>
            <ShieldAlert size={22} />
            <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
              This action cannot be undone
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)' }}>
            Your currency, notification, and display preferences will return to their default values.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" onClick={() => setIsResetModalOpen(false)} disabled={isResetting}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleReset} isLoading={isResetting}>
            {isResetting ? 'Resetting…' : 'Reset Preferences'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
