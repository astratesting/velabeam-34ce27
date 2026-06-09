import Hero from '@/components/marketing/Hero';
import { Radar, Wand2, Rocket } from 'lucide-react';
import BeamButton from '@/components/ui/BeamButton';

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Value props */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                numeral: 'I.',
                title: 'Discover',
                description:
                  'Find local businesses without a website in your area. Our AI scans and ranks prospects by opportunity value.',
                icon: Radar,
              },
              {
                numeral: 'II.',
                title: 'Generate',
                description:
                  'One click generates an industry-specific, deploy-ready website with real copy, sections, and contact info.',
                icon: Wand2,
              },
              {
                numeral: 'III.',
                title: 'Deploy',
                description:
                  'Preview, hand off, or deploy to a custom domain. White-label everything with your agency brand.',
                icon: Rocket,
              },
            ].map((item) => (
              <div key={item.title} className="border border-mist rounded-lg p-8 bg-ivory">
                <item.icon size={24} className="text-gold mb-4" strokeWidth={1.5} />
                <span className="font-display text-sm text-gold mb-2 block">{item.numeral}</span>
                <h3 className="font-display text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-ink text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-ivory mb-4">
            Ready to build your pipeline?
          </h2>
          <p className="text-ivory/60 mb-8">
            Start discovering prospects and generating sites today. No credit card required.
          </p>
          <a href="/sign-up">
            <BeamButton variant="primary" size="lg">
              Start free
            </BeamButton>
          </a>
        </div>
      </section>
    </>
  );
}
