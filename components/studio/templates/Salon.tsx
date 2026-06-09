import StudioRenderer from '../StudioRenderer';

const salonContent = {
  businessName: 'Sample Salon',
  tagline: 'Style meets sophistication',
  sections: [
    { type: 'hero' as const, heading: 'Your Style Destination', body: 'Expert stylists, premium products, and an experience you will love.', cta: { label: 'Book Now', href: '#contact' } },
    { type: 'services' as const, heading: 'Services', body: 'Full-service salon for hair, nails, and beauty.', items: [
      { title: 'Hair Styling', description: 'Cuts, color, and treatments' },
      { title: 'Nail Care', description: 'Manicures, pedicures, and nail art' },
      { title: 'Beauty', description: 'Facials, waxing, and makeup' },
    ]},
    { type: 'about' as const, heading: 'About Us', body: 'A premier salon dedicated to making you look and feel your best.' },
    { type: 'testimonials' as const, heading: 'Client Love', body: 'See what our clients are saying.', items: [
      { title: 'Amazing Stylists', description: 'Always leave feeling fabulous.' },
      { title: 'Best in Town', description: 'Professional service every visit.' },
    ]},
    { type: 'contact' as const, heading: 'Book Your Appointment', body: 'Walk-ins welcome or book ahead.', cta: { label: 'Book Appointment', href: '#contact' } },
  ],
};

export default function SalonTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={salonContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
