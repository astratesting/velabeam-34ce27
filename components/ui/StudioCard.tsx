import { cn } from '@/lib/cn';
import { ReactNode } from 'react';

interface StudioCardProps {
  children: ReactNode;
  className?: string;
  featured?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function StudioCard({ children, className, featured, onClick, href }: StudioCardProps) {
  const classes = cn(
    'bg-ivory border border-mist rounded-lg overflow-hidden transition-all duration-150',
    'hover:shadow-md hover:-translate-y-[1px]',
    featured && 'border-l-2 border-l-gold',
    onClick && 'cursor-pointer',
    className
  );

  const content = <>{children}</>;

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(classes, 'text-left w-full')}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}

export function StudioCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 pt-5 pb-3', className)}>{children}</div>;
}

export function StudioCardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 pb-5', className)}>{children}</div>;
}

export function StudioCardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-3 border-t border-mist', className)}>{children}</div>;
}
