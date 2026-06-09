import PricingCards from '@/components/marketing/PricingCards';

const faq = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. You can sign up and explore the dashboard for free. Site generation and deployment require a paid plan.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your billing settings. Your sites stay live until the end of the billing period.',
  },
  {
    q: 'What happens to my clients\' sites if I downgrade?',
    a: 'Existing sites remain live. You lose access to lead discovery and AI generation on lower-tier plans.',
  },
  {
    q: 'Do I need a Google Places API key?',
    a: 'VelaBeam includes a built-in prospect database for most US metro areas. The Google Places integration is optional for custom searches.',
  },
  {
    q: 'Can I use my own domain for client previews?',
    a: 'Yes. On Studio and Atelier plans, you can configure a custom domain for all client-facing URLs.',
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl font-bold text-charcoal mb-4">Simple, honest pricing</h1>
        <p className="text-lg text-fog max-w-xl mx-auto">
          Choose the plan that fits your business. No hidden fees, no surprises.
        </p>
      </div>

      <PricingCards />

      {/* FAQ */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faq.map((item) => (
            <div key={item.q} className="border-b border-mist pb-6">
              <h3 className="font-display text-base font-bold text-charcoal mb-2">{item.q}</h3>
              <p className="text-sm text-fog">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
