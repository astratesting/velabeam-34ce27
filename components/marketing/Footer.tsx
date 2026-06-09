import { cn } from '@/lib/cn';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-gold/30 py-12', className)}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-display text-sm font-bold text-charcoal mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="/features" className="text-sm text-fog hover:text-gold transition-colors">Features</a></li>
              <li><a href="/pricing" className="text-sm text-fog hover:text-gold transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-charcoal mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-fog hover:text-gold transition-colors">About</a></li>
              <li><a href="/contact" className="text-sm text-fog hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-charcoal mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-fog hover:text-gold transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-fog hover:text-gold transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-charcoal mb-4">Account</h4>
            <ul className="space-y-2">
              <li><a href="/sign-in" className="text-sm text-fog hover:text-gold transition-colors">Sign in</a></li>
              <li><a href="/sign-up" className="text-sm text-fog hover:text-gold transition-colors">Sign up</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-mist">
          <span className="font-display text-sm font-bold text-charcoal">VelaBeam</span>
          <p className="text-xs text-fog mt-2 sm:mt-0">Built for builders.</p>
        </div>
      </div>
    </footer>
  );
}
