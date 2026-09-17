import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        height: '24px',
        width: '44px',
        flexShrink: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '9999px',
        border: '2px solid transparent',
        transition: 'background-color 0.2s ease-in-out',
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
      }}
      onFocus={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-focus)'}
      onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <span
        style={{
          display: 'inline-block',
          height: '20px',
          width: '20px',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.2s ease-in-out',
        }}
      />
    </button>
  );
};
