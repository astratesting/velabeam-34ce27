import { cn } from '@/lib/cn';
import { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div>
        {eyebrow && (
          <p className="text-xs font-sans uppercase tracking-widest text-fog mb-1">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl font-bold text-charcoal">{title}</h1>
        {description && <p className="text-sm text-fog mt-1 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
