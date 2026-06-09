import { cn } from '@/lib/cn';

interface SerifKPIProps {
  value: string | number;
  label: string;
  delta?: string;
  deltaDirection?: 'up' | 'down';
  className?: string;
}

export default function SerifKPI({ value, label, delta, deltaDirection, className }: SerifKPIProps) {
  return (
    <div className={cn('bg-ivory border border-mist rounded-lg p-5 gold-underline', className)}>
      <div className="font-display text-3xl font-bold text-charcoal tracking-tight">
        {value}
      </div>
      <div className="text-sm text-fog mt-1">{label}</div>
      {delta && (
        <div
          className={cn(
            'text-xs mt-2 font-medium',
            deltaDirection === 'up' ? 'text-gold' : 'text-burgundy'
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
