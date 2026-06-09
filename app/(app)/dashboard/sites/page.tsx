'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import StatusPill from '@/components/ui/StatusPill';
import EmptyState from '@/components/ui/EmptyState';
import { getIndustryLabel } from '@/lib/industry';
import { Plus, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

const STATUS_FILTERS = ['all', 'draft', 'live', 'paused', 'error'] as const;

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sites');
      const data = await res.json();
      setSites(data.items ?? []);
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = statusFilter === 'all'
    ? sites
    : sites.filter((s) => s.status === statusFilter);

  return (
    <div className="animate-in">
      <PageHeader
        title="Sites"
        description="Manage all your generated and deployed websites."
        actions={
          <Link href="/dashboard/prospects">
            <BeamButton variant="primary"><Plus size={16} /> New site</BeamButton>
          </Link>
        }
      />

      {/* Status filters */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all border capitalize',
              statusFilter === status
                ? 'bg-gold/10 border-gold text-gold'
                : 'bg-ivory border-mist text-fog hover:border-gold/50'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sites grid */}
      {loading ? (
        <div className="py-16 text-center text-fog">Loading sites...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          headline="No sites yet"
          body="Generate your first site from the Prospects page."
          action={{ label: 'Find prospects', href: '/dashboard/prospects' }}
          icon={<Globe size={48} strokeWidth={1} />}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/sites/${site.id}`}
              className="group bg-ivory border border-mist rounded-lg overflow-hidden hover:border-gold transition-all"
            >
              {/* Preview placeholder */}
              <div className="aspect-[16/10] bg-mist/30 flex items-center justify-center relative">
                <Globe size={32} className="text-mist" strokeWidth={1} />
                <div className="absolute top-3 left-3">
                  <StatusPill status={site.status} />
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-charcoal group-hover:text-gold transition-colors">
                    {site.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-fog">{getIndustryLabel(site.industry)}</span>
                  <span className="text-xs text-fog font-mono">{site.slug}</span>
                </div>
              </div>
            </Link>
          ))}

          {/* New site card */}
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
      )}
    </div>
  );
}
