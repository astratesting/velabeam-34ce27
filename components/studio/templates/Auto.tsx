import StudioRenderer from '../StudioRenderer';

const autoContent = {
  businessName: 'Sample Auto Shop',
  tagline: 'Reliable service, honest pricing',
  sections: [
    { type: 'hero' as const, heading: 'Expert Auto Repair', body: 'Certified technicians keeping your vehicle running safely.', cta: { label: 'Schedule Service', href: '#contact' } },
    { type: 'services' as const, heading: 'Services', body: 'Complete automotive care.', items: [
      { title: 'Maintenance', description: 'Oil changes, tire rotation, inspections' },
      { title: 'Repair', description: 'Engine, transmission, and electrical' },
      { title: 'Diagnostics', description: 'Computer diagnostics and troubleshooting' },
    ]},
    { type: 'about' as const, heading: 'Our Shop', body: 'Family-owned and operated with a commitment to quality.' },
    { type: 'testimonials' as const, heading: 'Customer Reviews', body: 'Trusted by the community.', items: [
      { title: 'Honest and Fair', description: 'Transparent pricing and excellent work.' },
      { title: 'Quick Service', description: 'Fast turnaround without cutting corners.' },
    ]},
    { type: 'contact' as const, heading: 'Schedule Service', body: 'Call or book online for same-day appointments.', cta: { label: 'Book Now', href: '#contact' } },
  ],
};

export default function AutoTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={autoContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
