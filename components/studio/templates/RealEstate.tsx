import StudioRenderer from '../StudioRenderer';

const realEstateContent = {
  businessName: 'Sample Realty',
  tagline: 'Your trusted real estate partner',
  sections: [
    { type: 'hero' as const, heading: 'Find Your Dream Home', body: 'Local expertise, personalized service, and results that matter.', cta: { label: 'Browse Listings', href: '#services' } },
    { type: 'services' as const, heading: 'Services', body: 'Full-service real estate solutions.', items: [
      { title: 'Buyers', description: 'Find the perfect home at the right price' },
      { title: 'Sellers', description: 'Maximize your property value' },
      { title: 'Rentals', description: 'Quality rental properties available' },
    ]},
    { type: 'about' as const, heading: 'About Us', body: 'Experienced real estate professionals serving the local market.' },
    { type: 'testimonials' as const, heading: 'Client Experiences', body: 'Hear from happy homeowners.', items: [
      { title: 'Smooth Process', description: 'Made buying our first home stress-free.' },
      { title: 'Market Knowledge', description: 'Knew exactly how to price and market our home.' },
    ]},
    { type: 'contact' as const, heading: 'Get in Touch', body: 'Ready to start your real estate journey?', cta: { label: 'Contact Us', href: '#contact' } },
  ],
};

export default function RealEstateTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={realEstateContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
