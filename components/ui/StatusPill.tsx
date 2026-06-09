import { cn } from '@/lib/cn';

type Status = 'draft' | 'live' | 'paused' | 'error' | 'pending_dns' | 'new' | 'queued' | 'generated' | 'dismissed';

interface StatusPillProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'border-gold text-gold' },
  live: { label: 'Live', classes: 'bg-gold text-ivory' },
  paused: { label: 'Paused', classes: 'border-burgundy text-burgundy' },
  error: { label: 'Error', classes: 'bg-burgundy text-ivory' },
  pending_dns: { label: 'Pending DNS', classes: 'border-gold text-gold animate-pulse' },
  new: { label: 'New', classes: 'border-gold text-gold' },
  queued: { label: 'Queued', classes: 'border-gold text-gold' },
  generated: { label: 'Generated', classes: 'bg-gold text-ivory' },
  dismissed: { label: 'Dismissed', classes: 'border-fog text-fog' },
};

export default function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] ?? statusConfig.draft;
  const isFilled = ['live', 'error', 'generated'].includes(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        isFilled ? '' : 'border',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
