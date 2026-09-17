import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

export function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', padding: '1rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <CardContent style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>Create Account</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Join SpendWise today</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: '0.5rem', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)' }}>{error}</div>}
            
            <Input 
              label="Full Name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <Input 
              label="Email Address" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input 
              label="Password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button type="submit" isLoading={isLoading} style={{ marginTop: '1rem' }}>
              Sign Up
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)' }}>Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
