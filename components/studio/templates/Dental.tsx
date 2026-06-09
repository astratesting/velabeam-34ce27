import StudioRenderer from '../StudioRenderer';

const dentalContent = {
  businessName: 'Sample Dental Practice',
  tagline: 'Your smile, our priority',
  sections: [
    { type: 'hero' as const, heading: 'Compassionate Dental Care', body: 'Modern dentistry with a gentle touch for the whole family.', cta: { label: 'Book Appointment', href: '#contact' } },
    { type: 'services' as const, heading: 'Our Services', body: 'Comprehensive dental care for all ages.', items: [
      { title: 'Preventive Care', description: 'Cleanings, exams, and X-rays' },
      { title: 'Cosmetic Dentistry', description: 'Whitening, veneers, and bonding' },
      { title: 'Restorative', description: 'Fillings, crowns, and bridges' },
    ]},
    { type: 'about' as const, heading: 'About Our Practice', body: 'A trusted dental practice committed to your oral health and comfort.' },
    { type: 'testimonials' as const, heading: 'Patient Testimonials', body: 'Hear from our patients.', items: [
      { title: 'Best Dentist', description: 'Professional and caring staff. Highly recommended.' },
      { title: 'Family Friendly', description: 'My kids love coming here. Great experience every time.' },
    ]},
    { type: 'contact' as const, heading: 'Schedule Your Visit', body: 'New patients welcome. Call or book online.', cta: { label: 'Book Now', href: '#contact' } },
  ],
};

export default function DentalTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={dentalContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
