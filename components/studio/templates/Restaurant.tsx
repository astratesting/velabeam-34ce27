import StudioRenderer from '../StudioRenderer';

const restaurantContent = {
  businessName: 'Sample Restaurant',
  tagline: 'Fresh, local, unforgettable',
  sections: [
    { type: 'hero' as const, heading: 'Welcome to Our Kitchen', body: 'Farm-to-table dining in the heart of the community.', cta: { label: 'View Menu', href: '#services' } },
    { type: 'services' as const, heading: 'Our Menu', body: 'Seasonal dishes crafted with locally sourced ingredients.', items: [
      { title: 'Appetizers', description: 'Small plates to start your evening' },
      { title: 'Entrees', description: 'Chef-crafted seasonal mains' },
      { title: 'Desserts', description: 'House-made sweet endings' },
    ]},
    { type: 'about' as const, heading: 'Our Story', body: 'A family-owned restaurant serving the community with passion and quality.' },
    { type: 'testimonials' as const, heading: 'Guest Reviews', body: 'What our guests are saying.', items: [
      { title: 'Exceptional', description: 'The best dining experience in town.' },
      { title: 'A Must Visit', description: 'Incredible flavors and warm atmosphere.' },
    ]},
    { type: 'contact' as const, heading: 'Reservations', body: 'Book your table today.', cta: { label: 'Make a Reservation', href: '#contact' } },
  ],
};

export default function RestaurantTemplate({ brand }: { brand?: any }) {
  return <StudioRenderer content={restaurantContent} brand={brand ?? { agencyName: 'VelaBeam', logoUrl: null, primaryColor: '#B8956A', supportEmail: null, hidePoweredBy: false }} />;
}
