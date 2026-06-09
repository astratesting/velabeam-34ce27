import StudioRenderer from '../StudioRenderer';

const fitnessContent = {
  businessName: 'Sample Fitness Studio',
  tagline: 'Stronger every day',
  sections: [
    { type: 'hero' as const, heading: 'Transform Your Fitness', body: 'Expert coaching, supportive community, and real results.', cta: { label: 'Start Free Trial', href: '#contact' } },
    { type: 'services' as const, heading: 'Programs', body: 'Fitness programs for every level.', items: [
      { title: 'Personal Training', description: 'One-on-one customized workouts' },
      { title: 'Group Classes', description: 'High-energy group fitness sessions' },
      { title: 'Nutrition Coaching', description: 'Meal plans and dietary guidance' },
    ]},
    { type: 'about' as const, heading: 'Our Studio', body: 'A welcoming fitness community focused on helping you reach your goals.' },
    { type: 'testimonials' as const, heading: 'Member Stories', body: 'Real results from real people.', items: [
      { title: 'Life Changing', description: 'Lost 30 lbs and feel amazing.' },
      { title: 'Great Community', description: 'Supportive trainers and friendly members.' },
    ]},
    { type: 'contact' as const, heading: 'Join Today', body: 'Start your fitness journey with a free trial class.', cta: { label: 'Sign Up', href: '#contact' } },
  ],
};

export default function FitnessTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={fitnessContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
