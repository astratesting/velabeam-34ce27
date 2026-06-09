export const PLANS = {
  agency: {
    studio: {
      name: 'Studio',
      priceCents: 9900,
      interval: 'month' as const,
      features: [
        'Unlimited sites',
        'Lead discovery',
        'AI site generation',
        'White-label branding',
        'Custom domains',
        'Email support',
      ],
    },
    atelier: {
      name: 'Atelier',
      priceCents: 19900,
      interval: 'month' as const,
      recommended: true,
      features: [
        'Everything in Studio',
        'Priority generation',
        'Remove VelaBeam branding',
        'Advanced analytics',
        'Team collaboration (5 seats)',
        'Priority support',
      ],
    },
  },
  hosting: {
    starter: {
      name: 'Starter',
      priceCents: 1900,
      interval: 'month' as const,
      features: [
        '1 website',
        'SSL included',
        'Basic analytics',
        'Custom domain',
        'Monthly updates',
      ],
    },
    growth: {
      name: 'Growth',
      priceCents: 3900,
      interval: 'month' as const,
      features: [
        '3 websites',
        'SSL included',
        'Advanced analytics',
        'Custom domains',
        'Weekly updates',
        'Priority support',
      ],
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
export type PlanTier = keyof typeof PLANS.agency | keyof typeof PLANS.hosting;

export function getPlanByStripeId(priceId: string): { type: PlanType; tier: PlanTier } | null {
  // Map Stripe price IDs to plans — stub for dev
  return null;
}

export const FEATURE_COMPARISON = [
  { feature: 'Sites', studio: 'Unlimited', atelier: 'Unlimited', starter: '1', growth: '3' },
  { feature: 'Lead discovery', studio: true, atelier: true, starter: false, growth: false },
  { feature: 'AI generation', studio: true, atelier: true, starter: false, growth: false },
  { feature: 'White-label', studio: true, atelier: true, starter: false, growth: false },
  { feature: 'Custom domains', studio: true, atelier: true, starter: true, growth: true },
  { feature: 'Remove branding', studio: false, atelier: true, starter: false, growth: false },
  { feature: 'Team seats', studio: '1', atelier: '5', starter: '1', growth: '1' },
  { feature: 'Analytics', studio: 'Basic', atelier: 'Advanced', starter: 'Basic', growth: 'Advanced' },
  { feature: 'Support', studio: 'Email', atelier: 'Priority', starter: 'Email', growth: 'Priority' },
  { feature: 'Deploy pipeline', studio: true, atelier: true, starter: true, growth: true },
];
