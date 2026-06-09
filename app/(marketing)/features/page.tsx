import { Radar, Wand2, Rocket, Palette, Users, Globe } from 'lucide-react';
import BeamButton from '@/components/ui/BeamButton';

const features = [
  {
    icon: Radar,
    title: 'Lead Discovery',
    description:
      'Scan your area for local businesses without websites. Filter by industry, distance, and opportunity size. Every prospect shows estimated MRR so you can prioritize.',
  },
  {
    icon: Wand2,
    title: 'AI Site Generation',
    description:
      'Select a prospect, pick a template, and generate a complete website in seconds. Industry-specific copy, professional layout, real contact info — ready to preview.',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description:
      'Deploy to a custom domain with automatic DNS verification. Your client gets a live website; you get the credit.',
  },
  {
    icon: Palette,
    title: 'White-Label Branding',
    description:
      'Every client-facing surface shows your agency name, logo, and colors. Your brand, your business — VelaBeam stays invisible.',
  },
  {
    icon: Users,
    title: 'Client Management',
    description:
      'Track all your clients, their sites, and billing in one place. Add team members with role-based access.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description:
      'Map any domain to a generated site. Automatic SSL, DNS verification, and status monitoring included.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl font-bold text-charcoal mb-4">
        Everything you need to build at scale
      </h1>
      <p className="text-lg text-fog mb-16 max-w-2xl">
        VelaBeam replaces the entire manual workflow — from cold outreach to WordPress installs — with a single automated pipeline.
      </p>

      <div className="space-y-20">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={feature.title}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="flex-1">
                <div className="w-16 h-16 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <Icon size={28} className="text-gold" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-2xl font-bold text-charcoal mb-3">{feature.title}</h2>
                <p className="text-fog leading-relaxed">{feature.description}</p>
              </div>
              <div className="flex-1 h-64 bg-mist/30 rounded-lg border border-mist flex items-center justify-center">
                <Icon size={64} className="text-mist" strokeWidth={1} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-20 py-12 border-t border-gold/30">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Ready to get started?</h2>
        <a href="/sign-up">
          <BeamButton variant="primary" size="lg">Request access</BeamButton>
        </a>
      </div>
    </div>
  );
}
