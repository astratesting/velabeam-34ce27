'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import StatusPill from '@/components/ui/StatusPill';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/format';
import { getIndustryLabel, INDUSTRIES } from '@/lib/industry';
import { Radar, Search, Map, Table, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export default function ProspectsPage() {
  const [view, setView] = useState<'table' | 'map'>('table');
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (industryFilter.length > 0) params.set('industry', industryFilter.join(','));
      const res = await fetch(`/api/prospects?${params}`);
      const data = await res.json();
      setProspects(data.items ?? []);
    } catch {
      setProspects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setScanning(true);
    try {
      await fetch('/api/prospects/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: 34.0522, lng: -118.2437, radius: 40000, industries: INDUSTRIES.map(i => i.key) }),
      });
      await fetchProspects();
    } finally {
      setScanning(false);
    }
  };

  const toggleIndustry = (key: string) => {
    setIndustryFilter((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredProspects = prospects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (industryFilter.length > 0 && !industryFilter.includes(p.industry)) return false;
    return true;
  });

  return (
    <div className="animate-in">
      <PageHeader
        title="Prospects"
        description="Discover local businesses without websites in your area."
        actions={
          <BeamButton variant="primary" onClick={handleRefresh} loading={scanning}>
            <Radar size={16} /> Refresh leads
          </BeamButton>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog" />
          <input
            type="text"
            placeholder="Search prospects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ivory border border-mist rounded-md text-sm text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.key}
              onClick={() => toggleIndustry(ind.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                industryFilter.includes(ind.key)
                  ? 'bg-gold/10 border-gold text-gold'
                  : 'bg-ivory border-mist text-fog hover:border-gold/50'
              )}
            >
              {ind.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-mist/30 rounded-md p-0.5">
          <button
            onClick={() => setView('table')}
            className={cn('p-2 rounded', view === 'table' ? 'bg-ivory shadow-sm' : 'text-fog')}
            aria-label="Table view"
          >
            <Table size={16} />
          </button>
          <button
            onClick={() => setView('map')}
            className={cn('p-2 rounded', view === 'map' ? 'bg-ivory shadow-sm' : 'text-fog')}
            aria-label="Map view"
          >
            <Map size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-fog">Loading prospects...</div>
      ) : filteredProspects.length === 0 ? (
        <EmptyState
          headline="No prospects in range"
          body="Increase your radius or refresh leads to find businesses in your area."
          action={{ label: 'Refresh leads', onClick: handleRefresh }}
          icon={<Radar size={48} strokeWidth={1} />}
        />
      ) : view === 'table' ? (
        <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left py-3 px-4 text-xs font-medium text-fog uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-fog uppercase tracking-wider">Industry</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-fog uppercase tracking-wider">Address</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-fog uppercase tracking-wider">Has site?</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-fog uppercase tracking-wider">Est. MRR</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-fog uppercase tracking-wider">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.map((p) => (
                <tr key={p.id} className="border-b border-mist/50 hover:bg-mist/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-charcoal">{p.name}</td>
                  <td className="py-3 px-4 text-fog">{getIndustryLabel(p.industry)}</td>
                  <td className="py-3 px-4 text-fog text-xs">{p.address}</td>
                  <td className="py-3 px-4 text-center">
                    {p.has_website ? (
                      <span className="text-xs text-fog">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-burgundy/10 text-burgundy border border-burgundy/20">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs">{formatCurrency(p.est_mrr_cents)}</td>
                  <td className="py-3 px-4"><StatusPill status={p.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/prospects/${p.id}`}>
                        <BeamButton variant="ghost" size="sm">
                          <ChevronRight size={16} />
                        </BeamButton>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-ink rounded-lg h-[500px] flex items-center justify-center">
          <div className="text-center">
            <Map size={48} className="text-gold mx-auto mb-4" strokeWidth={1} />
            <p className="text-ivory/60 text-sm">Map view requires MapLibre configuration.</p>
            <p className="text-ivory/40 text-xs mt-1">Set NEXT_PUBLIC_MAP_TILE_URL in your environment.</p>
          </div>
        </div>
      )}
    </div>
  );
}
