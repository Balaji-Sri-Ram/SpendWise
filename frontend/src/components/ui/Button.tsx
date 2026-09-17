import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    // Add custom CSS modules or rely on inline classes/styles for vanilla CSS?
    // Since we are using Vanilla CSS variables without a utility framework, let's use a class based approach and define them in a module or just inject via standard classes and write the CSS in index.css or a Button.css.
    // For simplicity, let's just write the CSS classes that map to our variables.
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`btn btn-${variant} btn-${size} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
