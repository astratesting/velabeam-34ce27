import Footer from '@/components/marketing/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <header className="h-14 flex items-center justify-between px-6 border-b border-mist sticky top-0 bg-ivory/90 backdrop-blur-sm z-50">
        <a href="/" className="font-display text-lg font-bold text-charcoal tracking-wide">
          VelaBeam
        </a>
        <nav className="flex items-center gap-6">
          <a href="/features" className="text-sm text-fog hover:text-charcoal transition-colors">
            Features
          </a>
          <a href="/pricing" className="text-sm text-fog hover:text-charcoal transition-colors">
            Pricing
          </a>
          <a href="/about" className="text-sm text-fog hover:text-charcoal transition-colors">
            About
          </a>
          <a href="/contact" className="text-sm text-fog hover:text-charcoal transition-colors">
            Contact
          </a>
          <a href="/sign-in" className="text-sm text-gold hover:text-gold-hover transition-colors">
            Sign in
          </a>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
