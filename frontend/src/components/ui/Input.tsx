import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label htmlFor={id} className="input-label">{label}</label>}
        <input
          ref={ref}
          id={id}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="input-error-msg">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
