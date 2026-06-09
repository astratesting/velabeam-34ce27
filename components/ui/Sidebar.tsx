'use client';

import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radar,
  Globe,
  Users,
  Rocket,
  Palette,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Today', icon: LayoutDashboard },
  { href: '/dashboard/prospects', label: 'Prospects', icon: Radar },
  { href: '/dashboard/sites', label: 'Sites', icon: Globe },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/deploy', label: 'Deploy', icon: Rocket },
  { href: '/dashboard/brand', label: 'Brand', icon: Palette },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-ink text-ivory/80 flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-white/10">
        <a href="/dashboard" className="font-display text-lg font-bold text-ivory tracking-wide">
          VelaBeam
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    active
                      ? 'text-ivory bg-white/5 border-l-2 border-gold'
                      : 'text-ivory/60 hover:text-ivory hover:bg-white/5 border-l-2 border-transparent'
                  )}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 text-sm text-ivory/40 hover:text-ivory/80 transition-colors w-full"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
