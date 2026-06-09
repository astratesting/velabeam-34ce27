'use client';

import { cn } from '@/lib/cn';
import { STEP_LABELS, type JobStep } from '@/lib/job-types';

interface BeamProgressProps {
  step: JobStep;
  progress: number;
  className?: string;
}

export default function BeamProgress({ step, progress, className }: BeamProgressProps) {
  const steps: JobStep[] = ['analyze', 'copy', 'sections', 'publish'];
  const currentIdx = steps.indexOf(step);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-sm text-charcoal">
          {STEP_LABELS[step] ?? 'Processing...'}
        </span>
        <span className="text-xs text-fog font-mono">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-mist rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {steps.map((s, idx) => (
          <div
            key={s}
            className={cn(
              'text-xs transition-colors',
              idx <= currentIdx ? 'text-gold' : 'text-fog'
            )}
          >
            {STEP_LABELS[s]}
          </div>
        ))}
      </div>
    </div>
  );
}
