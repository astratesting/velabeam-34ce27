'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BeamButton from '@/components/ui/BeamButton';
import StatusPill from '@/components/ui/StatusPill';
import { formatCurrency } from '@/lib/format';
import { getIndustryLabel, INDUSTRIES } from '@/lib/industry';
import { X, MapPin, Phone, Globe, Star, Wand2 } from 'lucide-react';

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [prospect, setProspect] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (params.id) {
      fetch(`/api/prospects?id=${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          const p = data.items?.[0] ?? data;
          setProspect(p);
          setSelectedTemplate(p?.industry ?? 'general');
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handleGenerate = async () => {
    if (!prospect) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospectId: prospect.id,
          name: prospect.name,
          industry: prospect.industry,
          templateKey: selectedTemplate,
        }),
      });
      const data = await res.json();
      if (data.site?.id) {
        // Trigger generation
        await fetch(`/api/sites/${data.site.id}/generate`, { method: 'POST' });
        router.push(`/dashboard/sites/${data.site.id}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-fog">Loading...</div>;
  }

  if (!prospect) {
    return <div className="py-16 text-center text-fog">Prospect not found.</div>;
  }

  return (
    <div className="animate-in max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <button onClick={() => router.back()} className="text-sm text-fog hover:text-charcoal mb-2 flex items-center gap-1">
            <X size={14} /> Back to prospects
          </button>
          <h1 className="font-display text-3xl font-bold text-charcoal">{prospect.name}</h1>
          <p className="text-fog text-sm mt-1">{getIndustryLabel(prospect.industry)}</p>
        </div>
        <StatusPill status={prospect.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Business details */}
        <div className="space-y-6">
          <div className="bg-ivory border border-mist rounded-lg p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Business Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-fog flex-shrink-0" />
                <span className="text-charcoal">{prospect.address}</span>
              </div>
              {prospect.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-fog flex-shrink-0" />
                  <span className="text-charcoal">{prospect.phone}</span>
                </div>
              )}
              {prospect.website_url && (
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-fog flex-shrink-0" />
                  <a href={prospect.website_url} target="_blank" rel="noopener" className="text-gold hover:underline">
                    {prospect.website_url}
                  </a>
                </div>
              )}
              {prospect.rating && (
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-fog flex-shrink-0" />
                  <span className="text-charcoal">
                    {Number(prospect.rating).toFixed(1)} ({prospect.review_count} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-ivory border border-mist rounded-lg p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Opportunity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-fog">Estimated MRR</span>
                <p className="font-display text-xl font-bold text-gold">{formatCurrency(prospect.est_mrr_cents)}</p>
              </div>
              <div>
                <span className="text-xs text-fog">Reviews</span>
                <p className="font-display text-xl font-bold text-charcoal">{prospect.review_count}</p>
              </div>
            </div>
          </div>

          <div className="bg-ivory border border-mist rounded-lg p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Why we picked it</h2>
            <ul className="space-y-2 text-sm text-fog">
              <li className="flex gap-2">
                <span className="text-gold">1.</span>
                No working website detected — high conversion potential.
              </li>
              <li className="flex gap-2">
                <span className="text-gold">2.</span>
                Active business with {prospect.review_count} reviews — established customer base.
              </li>
              <li className="flex gap-2">
                <span className="text-gold">3.</span>
                {getIndustryLabel(prospect.industry)} industry — matches your selected verticals.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Generate site panel */}
        <div>
          <div className="bg-ivory border border-gold rounded-lg p-6 sticky top-20">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Generate site</h2>
            <p className="text-sm text-fog mb-6">
              We&apos;ll create an industry-specific website for {prospect.name} using the {getIndustryLabel(prospect.industry)} template.
            </p>

            <div className="mb-6">
              <label className="block text-sm text-fog mb-2">Template</label>
              <div className="grid grid-cols-2 gap-2">
                {['restaurant', 'dental', 'legal', 'salon'].map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all ${
                      selectedTemplate === key
                        ? 'border-gold bg-gold/5 text-gold'
                        : 'border-mist text-fog hover:border-gold/50'
                    }`}
                  >
                    {getIndustryLabel(key)}
                  </button>
                ))}
              </div>
            </div>

            <BeamButton
              variant="primary"
              className="w-full"
              onClick={handleGenerate}
              loading={generating}
            >
              <Wand2 size={16} /> Generate site
            </BeamButton>
          </div>
        </div>
      </div>
    </div>
  );
}
