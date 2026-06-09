import StudioRenderer from '../StudioRenderer';

const legalContent = {
  businessName: 'Sample Law Firm',
  tagline: 'Trusted legal counsel',
  sections: [
    { type: 'hero' as const, heading: 'Experienced Legal Representation', body: 'Dedicated attorneys serving individuals and businesses.', cta: { label: 'Free Consultation', href: '#contact' } },
    { type: 'services' as const, heading: 'Practice Areas', body: 'Comprehensive legal services.', items: [
      { title: 'Business Law', description: 'Contracts, formation, and compliance' },
      { title: 'Family Law', description: 'Divorce, custody, and mediation' },
      { title: 'Estate Planning', description: 'Wills, trusts, and probate' },
    ]},
    { type: 'about' as const, heading: 'Our Firm', body: 'A trusted law firm with decades of combined experience.' },
    { type: 'testimonials' as const, heading: 'Client Reviews', body: 'What our clients say.', items: [
      { title: 'Outstanding Counsel', description: 'Thorough, responsive, and effective.' },
      { title: 'Highly Recommended', description: 'Made a complex process simple and stress-free.' },
    ]},
    { type: 'contact' as const, heading: 'Contact Us', body: 'Schedule a free consultation today.', cta: { label: 'Get Started', href: '#contact' } },
  ],
};

export default function LegalTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={legalContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
