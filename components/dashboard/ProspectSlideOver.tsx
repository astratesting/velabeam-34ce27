'use client';

import { cn } from '@/lib/cn';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ProspectSlideOverProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function ProspectSlideOver({ open, onClose, children, className }: ProspectSlideOverProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-full max-w-lg bg-ivory border-l border-mist z-50 overflow-y-auto',
          'animate-in',
          className
        )}
      >
        <div className="sticky top-0 bg-ivory border-b border-mist px-6 py-4 flex items-center justify-between">
          <span className="font-display text-sm font-bold text-charcoal">Prospect Details</span>
          <button
            onClick={onClose}
            className="p-1 text-fog hover:text-charcoal transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}
