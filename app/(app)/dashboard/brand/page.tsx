'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import { Save } from 'lucide-react';

export default function BrandPage() {
  const [brand, setBrand] = useState({
    agencyName: '',
    logoUrl: '',
    primaryColor: '#B8956A',
    supportEmail: '',
    hidePoweredBy: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/brand')
      .then((r) => r.json())
      .then((data) => {
        if (data.brand) {
          setBrand({
            agencyName: data.brand.agency_name ?? '',
            logoUrl: data.brand.logo_url ?? '',
            primaryColor: data.brand.primary_color ?? '#B8956A',
            supportEmail: data.brand.support_email ?? '',
            hidePoweredBy: data.brand.hide_powered_by ?? false,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/brand', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName: brand.agencyName,
          logoUrl: brand.logoUrl,
          primaryColor: brand.primaryColor,
          supportEmail: brand.supportEmail,
          hidePoweredBy: brand.hidePoweredBy,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-fog">Loading...</div>;
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Brand"
        description="Configure white-label branding for all client-facing surfaces."
        actions={
          <BeamButton variant="primary" onClick={handleSave} loading={saving}>
            <Save size={16} /> Save changes
          </BeamButton>
        }
      />

      {saved && (
        <div className="mb-6 p-3 rounded-md bg-gold/10 border border-gold/20 text-gold text-sm">
          Brand settings saved successfully.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-ivory border border-mist rounded-lg p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Agency Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="agency-name" className="block text-sm text-fog mb-1">Agency name</label>
                <input
                  id="agency-name"
                  type="text"
                  value={brand.agencyName}
                  onChange={(e) => setBrand({ ...brand, agencyName: e.target.value })}
                  className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
                  placeholder="Your Studio Name"
                />
              </div>
              <div>
                <label htmlFor="logo-url" className="block text-sm text-fog mb-1">Logo URL</label>
                <input
                  id="logo-url"
                  type="url"
                  value={brand.logoUrl}
                  onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
                  className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal font-mono text-sm focus:border-gold focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label htmlFor="primary-color" className="block text-sm text-fog mb-2">Primary color</label>
                <div className="flex items-center gap-4">
                  <input
                    id="primary-color"
                    type="color"
                    value={brand.primaryColor}
                    onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-mist"
                  />
                  <input
                    type="text"
                    value={brand.primaryColor}
                    onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                    className="w-32 py-2 border-b border-mist bg-transparent text-charcoal font-mono text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="support-email" className="block text-sm text-fog mb-1">Support email</label>
                <input
                  id="support-email"
                  type="email"
                  value={brand.supportEmail}
                  onChange={(e) => setBrand({ ...brand, supportEmail: e.target.value })}
                  className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
                  placeholder="support@youragency.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-ivory border border-mist rounded-lg p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Branding</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={brand.hidePoweredBy}
                onChange={(e) => setBrand({ ...brand, hidePoweredBy: e.target.checked })}
                className="w-4 h-4 accent-gold"
              />
              <div>
                <span className="text-sm text-charcoal">Remove &quot;Powered by VelaBeam&quot;</span>
                <p className="text-xs text-fog">Available on Atelier plan. Removes VelaBeam branding from all client surfaces.</p>
              </div>
            </label>
          </div>

          <div className="bg-ivory border border-mist rounded-lg p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">Custom Domain</h2>
            <p className="text-sm text-fog mb-4">
              Set up a custom domain for your client preview URLs.
            </p>
            <div className="bg-ink rounded-md p-4">
              <p className="text-xs text-ivory/60 mb-2">Add this CNAME record to your DNS:</p>
              <code className="text-xs text-gold font-mono block">
                preview.youragency.com → CNAME → velabeam.app
              </code>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">Live Preview</h2>
          <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
            <div className="h-10 bg-mist/30 flex items-center px-4 border-b border-mist">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-burgundy/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-gold/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-ivory rounded px-3 py-1 text-xs text-fog font-mono text-center">
                  preview.{brand.agencyName.toLowerCase().replace(/\s+/g, '')}.com
                </div>
              </div>
            </div>
            <div className="h-[500px] flex items-center justify-center bg-mist/10">
              <div className="text-center px-8">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: brand.primaryColor + '20' }}
                >
                  <span className="font-display text-xl font-bold" style={{ color: brand.primaryColor }}>
                    {brand.agencyName.charAt(0) || 'V'}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-charcoal mb-2">
                  {brand.agencyName || 'Your Agency'}
                </h3>
                <p className="text-sm text-fog">
                  Client preview pages will display your branding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
