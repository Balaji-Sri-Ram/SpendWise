import { use3DTilt } from '../../hooks/use3DTilt';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  glassLevel?: 1 | 2 | 3 | 4;
}

export function Card({ children, className = '', interactive = false, glassLevel, ...props }: CardProps) {
  const tiltRef = use3DTilt<HTMLDivElement>(interactive);
  
  return (
    <div ref={tiltRef} className={`card ${glassLevel ? 'glass-l' + glassLevel : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
}
