import { auth } from '@/auth';
import { User } from 'lucide-react';

export default async function Topbar() {
  const session = await auth();
  const name = session?.user?.name ?? 'there';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 bg-ivory border-b border-mist flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Wordmark */}
      <a href="/dashboard" className="font-display text-sm font-bold text-charcoal tracking-wide">
        VelaBeam
      </a>

      {/* Center — workspace info (can be expanded later) */}
      <div className="hidden md:block">
        <span className="text-xs text-fog">Studio Workspace</span>
      </div>

      {/* Right — user */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-medium">
          {initials || <User size={16} strokeWidth={1.5} />}
        </div>
      </div>
    </header>
  );
}
