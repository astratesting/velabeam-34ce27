'use client';

import { cn } from '@/lib/cn';
import { INDUSTRIES } from '@/lib/industry';

interface StepIndustriesProps {
  selected: string[];
  onToggle: (key: string) => void;
}

export default function StepIndustries({ selected, onToggle }: StepIndustriesProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-charcoal mb-2">What industries?</h2>
        <p className="text-sm text-fog">
          Select the types of local businesses you want to build sites for. We&apos;ll prioritize these in prospect discovery.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {INDUSTRIES.map((industry) => {
          const isSelected = selected.includes(industry.key);
          return (
            <button
              key={industry.key}
              type="button"
              onClick={() => onToggle(industry.key)}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-medium transition-all border',
                isSelected
                  ? 'bg-gold/10 border-gold text-gold'
                  : 'bg-ivory border-mist text-fog hover:border-gold/50 hover:text-charcoal'
              )}
            >
              {industry.label}
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-burgundy">Please select at least one industry.</p>
      )}
    </div>
  );
}
