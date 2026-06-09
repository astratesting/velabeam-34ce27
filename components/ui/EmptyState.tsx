import { cn } from '@/lib/cn';
import { ReactNode } from 'react';
import BeamButton from './BeamButton';

interface EmptyStateProps {
  headline: string;
  body: string;
  action?: { label: string; onClick?: () => void; href?: string };
  icon?: ReactNode;
  className?: string;
}

export default function EmptyState({ headline, body, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      {icon && <div className="mb-4 text-fog">{icon}</div>}
      <h3 className="font-display text-xl text-charcoal mb-2">{headline}</h3>
      <p className="text-sm text-fog max-w-md mb-6">{body}</p>
      {action &&
        (action.href ? (
          <a href={action.href}>
            <BeamButton variant="primary">{action.label}</BeamButton>
          </a>
        ) : (
          <BeamButton variant="primary" onClick={action.onClick}>
            {action.label}
          </BeamButton>
        ))}
    </div>
  );
}
