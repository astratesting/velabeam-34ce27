'use client';

import StatusPill from '@/components/ui/StatusPill';
import { getIndustryLabel } from '@/lib/industry';
import { Globe, Plus } from 'lucide-react';
import Link from 'next/link';

interface Site {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: string;
}

interface SitesGridProps {
  sites: Site[];
}

export default function SitesGrid({ sites }: SitesGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site) => (
        <Link
          key={site.id}
          href={`/dashboard/sites/${site.id}`}
          className="group bg-ivory border border-mist rounded-lg overflow-hidden hover:border-gold transition-all"
        >
          <div className="aspect-[16/10] bg-mist/30 flex items-center justify-center relative">
            <Globe size={32} className="text-mist" strokeWidth={1} />
            <div className="absolute top-3 left-3">
              <StatusPill status={site.status as any} />
            </div>
          </div>
          <div className="p-4">
            <span className="font-display text-sm font-bold text-charcoal group-hover:text-gold transition-colors">
              {site.name}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-fog">{getIndustryLabel(site.industry)}</span>
              <span className="text-xs text-fog font-mono">{site.slug}</span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/dashboard/prospects"
        className="border-2 border-dashed border-gold/40 rounded-lg aspect-[16/10] flex flex-col items-center justify-center gap-2 hover:border-gold transition-colors group"
      >
        <Plus size={24} className="text-gold/60 group-hover:text-gold transition-colors" />
        <span className="font-display text-sm text-gold/60 group-hover:text-gold transition-colors">
          Create from scratch
        </span>
      </Link>
    </div>
  );
}
