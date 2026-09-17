import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, id, options, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label htmlFor={id} className="input-label">{label}</label>}
        <select
          ref={ref}
          id={id}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="input-error-msg">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
