interface SiteSection {
  type: 'hero' | 'services' | 'about' | 'testimonials' | 'contact';
  heading: string;
  body: string;
  items?: { title: string; description: string }[];
  cta?: { label: string; href: string };
}

interface Content {
  businessName: string;
  tagline: string;
  sections: SiteSection[];
}

interface BrandConfig {
  agencyName: string;
  logoUrl: string | null;
  primaryColor: string;
  supportEmail: string | null;
  hidePoweredBy: boolean;
}

export default function StudioRenderer({ content, brand }: { content: Content; brand: BrandConfig }) {
  if (!content?.sections) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F1E8' }}>
        <p style={{ color: '#9A958A' }}>No content available.</p>
      </div>
    );
  }

  const primaryColor = brand.primaryColor || '#B8956A';

  return (
    <div style={{ fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif', background: '#F5F1E8', color: '#1A1A1C', minHeight: '100vh' }}>
      {/* Hero section */}
      {content.sections.filter(s => s.type === 'hero').map((section, idx) => (
        <section
          key={`hero-${idx}`}
          style={{
            background: '#0E0E10',
            color: '#F5F1E8',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {brand.logoUrl && (
              <img src={brand.logoUrl} alt={brand.agencyName} style={{ height: 40, marginBottom: 24 }} />
            )}
            <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 48, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
              {section.heading}
            </h1>
            <p style={{ fontSize: 18, color: '#F5F1E8', opacity: 0.7, marginBottom: 32, lineHeight: 1.6 }}>
              {section.body}
            </p>
            {section.cta && (
              <a
                href={section.cta.href}
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: primaryColor,
                  color: '#F5F1E8',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
              >
                {section.cta.label}
              </a>
            )}
          </div>
        </section>
      ))}

      {/* Other sections */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {content.sections.filter(s => s.type !== 'hero').map((section, idx) => (
          <section key={`${section.type}-${idx}`} style={{ padding: '64px 0', borderBottom: '1px solid #E8E2D5' }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16,
              color: '#1A1A1C',
            }}>
              {section.heading}
            </h2>
            <p style={{ fontSize: 16, color: '#9A958A', lineHeight: 1.7, marginBottom: 32 }}>
              {section.body}
            </p>

            {/* Items (services, testimonials) */}
            {section.items && section.items.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 24,
                marginBottom: 32,
              }}>
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8E2D5',
                      borderRadius: 8,
                      padding: 24,
                    }}
                  >
                    <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 14, color: '#9A958A', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {section.cta && (
              <a
                href={section.cta.href}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  border: `1px solid ${primaryColor}`,
                  color: primaryColor,
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {section.cta.label}
              </a>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#0E0E10',
        color: '#F5F1E8',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            {content.businessName}
          </p>
          {brand.supportEmail && (
            <a href={`mailto:${brand.supportEmail}`} style={{ color: primaryColor, fontSize: 14, textDecoration: 'none' }}>
              {brand.supportEmail}
            </a>
          )}
          {!brand.hidePoweredBy && (
            <p style={{ fontSize: 12, color: '#F5F1E8', opacity: 0.3, marginTop: 24 }}>
              Built by {brand.agencyName}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
