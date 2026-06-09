import { cn } from '@/lib/cn';
import BeamButton from '@/components/ui/BeamButton';

interface HeroProps {
  className?: string;
}

export default function Hero({ className }: HeroProps) {
  return (
    <section className={cn('relative min-h-[80vh] flex items-center justify-center overflow-hidden', className)}>
      {/* Background */}
      <div className="absolute inset-0 bg-ink">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/harbor-1.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
          The beam that finds, builds, and ships your next client.
        </h1>
        <p className="text-lg text-ivory/70 max-w-xl mx-auto mb-10">
          AI-powered pipeline that discovers local businesses without websites, generates industry-specific sites in one click, and deploys them — all from a single dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/sign-up">
            <BeamButton variant="primary" size="lg">
              Start free
            </BeamButton>
          </a>
          <a href="/pricing">
            <BeamButton variant="secondary" size="lg" className="border-ivory/30 text-ivory hover:bg-ivory/10">
              See pricing
            </BeamButton>
          </a>
        </div>
      </div>
    </section>
  );
}
