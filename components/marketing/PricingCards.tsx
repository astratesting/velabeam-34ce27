'use client';

import { cn } from '@/lib/cn';
import { PLANS, FEATURE_COMPARISON } from '@/lib/pricing';
import BeamButton from '@/components/ui/BeamButton';
import { Check } from 'lucide-react';

export default function PricingCards() {
  return (
    <div>
      {/* Agency Plans */}
      <div className="mb-16">
        <h3 className="font-display text-xl text-charcoal mb-2">For Agencies</h3>
        <p className="text-sm text-fog mb-8">Manage client sites, discover prospects, and grow your business.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {Object.entries(PLANS.agency).map(([key, plan]) => (
            <div
              key={key}
              className={cn(
                'border rounded-lg p-8 bg-ivory transition-all',
                'recommended' in plan && plan.recommended
                  ? 'border-gold shadow-md relative'
                  : 'border-mist'
              )}
            >
              {'recommended' in plan && plan.recommended && (
                <span className="absolute -top-3 left-6 bg-gold text-ivory text-xs px-3 py-1 rounded-full font-medium">
                  Recommended
                </span>
              )}
              <h4 className="font-display text-lg font-bold text-charcoal">{plan.name}</h4>
              <div className="mt-2 mb-6">
                <span className="font-display text-3xl font-bold text-charcoal">
                  ${plan.priceCents / 100}
                </span>
                <span className="text-fog text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-charcoal">
                    <Check size={16} className="text-gold flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <BeamButton
                variant={'recommended' in plan && plan.recommended ? 'primary' : 'secondary'}
                className="w-full"
              >
                Get started
              </BeamButton>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hosting Plans */}
      <div className="mb-16">
        <h3 className="font-display text-xl text-charcoal mb-2">For Business Hosting</h3>
        <p className="text-sm text-fog mb-8">Simple hosting for businesses that already have a site built.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {Object.entries(PLANS.hosting).map(([key, plan]) => (
            <div key={key} className="border border-mist rounded-lg p-8 bg-ivory">
              <h4 className="font-display text-lg font-bold text-charcoal">{plan.name}</h4>
              <div className="mt-2 mb-6">
                <span className="font-display text-3xl font-bold text-charcoal">
                  ${plan.priceCents / 100}
                </span>
                <span className="text-fog text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-charcoal">
                    <Check size={16} className="text-gold flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <BeamButton variant="secondary" className="w-full">
                Get started
              </BeamButton>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="max-w-4xl">
        <h3 className="font-display text-xl text-charcoal mb-6">Feature comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-mist rounded-lg">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left py-3 px-4 font-medium text-fog">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-fog">Studio</th>
                <th className="text-center py-3 px-4 font-medium text-gold">Atelier</th>
                <th className="text-center py-3 px-4 font-medium text-fog">Starter</th>
                <th className="text-center py-3 px-4 font-medium text-fog">Growth</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_COMPARISON.map((row) => (
                <tr key={row.feature} className="border-b border-mist/50">
                  <td className="py-3 px-4 text-charcoal">{row.feature}</td>
                  {(['studio', 'atelier', 'starter', 'growth'] as const).map((plan) => (
                    <td key={plan} className="py-3 px-4 text-center font-mono text-xs">
                      {typeof row[plan] === 'boolean' ? (
                        row[plan] ? (
                          <Check size={16} className="mx-auto text-gold" />
                        ) : (
                          <span className="text-fog">—</span>
                        )
                      ) : (
                        row[plan]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
