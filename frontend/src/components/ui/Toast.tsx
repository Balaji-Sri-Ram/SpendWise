import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastType } from '../../context/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClosing(true), 2700);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />;
      case 'error':
        return <XCircle size={20} style={{ color: 'var(--color-danger)' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />;
      case 'info':
        return <Info size={20} style={{ color: 'var(--color-accent)' }} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--color-border)',
      minWidth: '300px',
      maxWidth: '400px',
      opacity: isClosing ? 0 : 1,
      transform: isClosing ? 'translateX(100%)' : 'translateX(0)',
      transition: 'all var(--transition-normal)',
    }}>
      <div style={{ flexShrink: 0 }}>
        {getIcon()}
      </div>
      <div style={{ flexGrow: 1, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
        {message}
      </div>
      <button 
        onClick={handleClose}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'var(--color-text-muted)', 
          cursor: 'pointer',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
