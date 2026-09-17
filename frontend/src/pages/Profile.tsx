import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import type { User } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { User as UserIcon, Mail, Calendar, LogOut, Edit2, X, Save } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';

export const Profile: React.FC = () => {
  const { user: authUser, logout, updateAuthUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await profileService.getCurrentUser();
        setProfile(data);
        setFormData({ name: data.name, email: data.email });
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    if (displayUser) {
      setFormData({ name: displayUser.name, email: displayUser.email });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedUser = await profileService.updateProfile(formData);
      setProfile(updatedUser);
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
      // If auth context stores user name/email, we might want to update it there too.
      if (updateAuthUser) {
        updateAuthUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Fallback to auth user if profile fetch failed
  const displayUser = profile || authUser;

  if (!displayUser) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Unable to load profile information.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const settingsCtx = useSettings();
  const dateFormat = settingsCtx?.dateFormat || 'DD_MMM_YYYY';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Profile
        </h1>
        <p style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
          Manage your personal information and account settings.
        </p>
      </div>

      <Card style={{ marginBottom: '2rem' }}>
        <CardContent style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: 'var(--color-primary)', 
            color: 'var(--color-primary-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            {getInitials(displayUser.name)}
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              {displayUser.name}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} />
              {displayUser.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <Card>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              Personal Information
            </h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 size={16} style={{ marginRight: '0.5rem' }} />
                Edit Profile
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
                  <X size={16} style={{ marginRight: '0.25rem' }} />
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
                  <Save size={16} style={{ marginRight: '0.25rem' }} />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
          <CardContent style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                {isEditing ? (
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    disabled={isSaving}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <UserIcon size={18} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{displayUser.name}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                {isEditing ? (
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    type="email"
                    disabled={isSaving}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <Mail size={18} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{displayUser.email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              Account Information
            </h3>
          </div>
          <CardContent style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  Member Since
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <Calendar size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{formatDate(displayUser.createdAt, dateFormat)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button 
            variant="outline" 
            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
            onClick={logout}
          >
            <LogOut size={18} style={{ marginRight: '0.5rem' }} />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
