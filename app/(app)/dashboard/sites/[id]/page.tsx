'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import StatusPill from '@/components/ui/StatusPill';
import BeamProgress from '@/components/ui/BeamProgress';
import { getIndustryLabel } from '@/lib/industry';
import { cn } from '@/lib/cn';
import { ExternalLink, Pause, ArrowRightLeft, Settings, Eye, Code, Activity, CreditCard } from 'lucide-react';

const TABS = [
  { key: 'preview', label: 'Preview', icon: Eye },
  { key: 'editor', label: 'Editor', icon: Code },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
] as const;

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as string;
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'preview');

  const [site, setSite] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deployModal, setDeployModal] = useState(false);
  const [hostname, setHostname] = useState('');
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/sites/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          setSite(data.site ?? data);
          setJob(data.job ?? null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  const handleDeploy = async () => {
    if (!hostname) return;
    setDeploying(true);
    try {
      const res = await fetch(`/api/sites/${params.id}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname }),
      });
      const data = await res.json();
      if (data.success) {
        setSite((s: any) => ({ ...s, status: 'pending_dns' }));
        setDeployModal(false);
      }
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-fog">Loading...</div>;
  }

  if (!site) {
    return <div className="py-16 text-center text-fog">Site not found.</div>;
  }

  return (
    <div className="animate-in">
      <PageHeader
        title={site.name}
        actions={
          <div className="flex items-center gap-3">
            {site.preview_token && (
              <a href={`/preview/${site.preview_token}`} target="_blank" rel="noopener">
                <BeamButton variant="secondary" size="sm">
                  <ExternalLink size={14} /> Preview
                </BeamButton>
              </a>
            )}
            <BeamButton variant="ghost" size="sm" onClick={() => setSite((s: any) => ({ ...s, status: 'paused' }))}>
              <Pause size={14} /> Pause
            </BeamButton>
            <BeamButton variant="primary" size="sm" onClick={() => setDeployModal(true)}>
              <ArrowRightLeft size={14} /> Transfer
            </BeamButton>
          </div>
        }
      />

      {/* Status bar */}
      <div className="flex items-center gap-4 mb-6">
        <StatusPill status={site.status} />
        <span className="text-xs text-fog font-mono">{site.slug}</span>
        <span className="text-xs text-fog">{getIndustryLabel(site.industry)}</span>
      </div>

      {/* Generation progress */}
      {job && job.status === 'running' && (
        <div className="mb-6 p-4 bg-ivory border border-mist rounded-lg">
          <BeamProgress step={job.step} progress={job.progress} />
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-mist mb-6">
        <nav className="flex gap-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b-2',
                  activeTab === tab.key
                    ? 'border-gold text-charcoal font-medium'
                    : 'border-transparent text-fog hover:text-charcoal'
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'preview' && (
        <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
          <div className="h-10 bg-mist/30 flex items-center px-4 border-b border-mist">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-burgundy/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-gold/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-ivory rounded px-3 py-1 text-xs text-fog font-mono text-center">
                {site.preview_token ? `/preview/${site.preview_token}` : 'No preview available'}
              </div>
            </div>
          </div>
          {site.preview_token ? (
            <iframe
              src={`/preview/${site.preview_token}`}
              className="w-full h-[600px] border-0"
              title="Site preview"
            />
          ) : (
            <div className="h-[600px] flex items-center justify-center">
              <p className="text-fog text-sm">Generate the site to see a preview.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="bg-ivory border border-mist rounded-lg p-12 text-center">
          <p className="font-display text-lg text-charcoal mb-2">Visual editor</p>
          <p className="text-sm text-fog">The visual editor is coming in a future update.</p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <p className="text-sm text-fog text-center py-8">No activity recorded yet.</p>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs text-fog">MRR</span>
              <p className="font-display text-xl font-bold text-charcoal">—</p>
            </div>
            <div>
              <span className="text-xs text-fog">Last invoice</span>
              <p className="font-display text-xl font-bold text-charcoal">—</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-ivory border border-mist rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm text-fog mb-1">Site name</label>
            <input
              type="text"
              defaultValue={site.name}
              className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-fog mb-1">Template</label>
            <p className="text-sm text-charcoal">{getIndustryLabel(site.template_key)}</p>
          </div>
          <BeamButton variant="secondary" size="sm">Save changes</BeamButton>
        </div>
      )}

      {/* Deploy modal */}
      {deployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm">
          <div className="bg-ivory rounded-lg border border-mist p-8 max-w-md w-full mx-4">
            <h2 className="font-display text-xl font-bold text-charcoal mb-4">Deploy to custom domain</h2>
            <p className="text-sm text-fog mb-6">
              Enter the domain where this site should be served. You&apos;ll need to set up a CNAME record pointing to our servers.
            </p>
            <div className="mb-6">
              <label htmlFor="hostname" className="block text-sm text-fog mb-1">Domain</label>
              <input
                id="hostname"
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                placeholder="www.client-domain.com"
                className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal font-mono text-sm focus:border-gold focus:outline-none"
              />
            </div>
            {hostname && (
              <div className="mb-6 p-3 bg-ink rounded-md">
                <p className="text-xs text-ivory/60 mb-1">Add this CNAME record:</p>
                <code className="text-xs text-gold font-mono">
                  {hostname} → CNAME → vb-{site.id?.slice(0, 8)}.velabeam.app
                </code>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <BeamButton variant="ghost" onClick={() => setDeployModal(false)}>Cancel</BeamButton>
              <BeamButton variant="primary" onClick={handleDeploy} loading={deploying} disabled={!hostname}>
                Deploy
              </BeamButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
