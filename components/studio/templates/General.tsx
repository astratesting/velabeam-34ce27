import StudioRenderer from '../StudioRenderer';

const generalContent = {
  businessName: 'Sample Business',
  tagline: 'Quality service, every time',
  sections: [
    { type: 'hero' as const, heading: 'Welcome to Our Business', body: 'Professional services tailored to your needs.', cta: { label: 'Learn More', href: '#services' } },
    { type: 'services' as const, heading: 'What We Offer', body: 'Services designed to help you succeed.', items: [
      { title: 'Consultation', description: 'Personalized guidance and planning' },
      { title: 'Core Services', description: 'Professional solutions for your needs' },
      { title: 'Support', description: 'Ongoing assistance and maintenance' },
    ]},
    { type: 'about' as const, heading: 'About Us', body: 'A trusted local business committed to quality and customer satisfaction.' },
    { type: 'testimonials' as const, heading: 'What Clients Say', body: 'Feedback from those we serve.', items: [
      { title: 'Excellent Service', description: 'Professional, reliable, and always on time.' },
      { title: 'Highly Recommended', description: 'Would recommend to anyone looking for quality.' },
    ]},
    { type: 'contact' as const, heading: 'Get Started', body: 'Reach out to discuss how we can help.', cta: { label: 'Contact Us', href: '#contact' } },
  ],
};

export default function GeneralTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={generalContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
