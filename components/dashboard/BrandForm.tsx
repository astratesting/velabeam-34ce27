'use client';

import { useState } from 'react';
import BeamButton from '@/components/ui/BeamButton';
import { Save } from 'lucide-react';

interface BrandFormProps {
  initialData?: {
    agencyName?: string;
    logoUrl?: string;
    primaryColor?: string;
    supportEmail?: string;
    hidePoweredBy?: boolean;
  };
  onSave?: (data: any) => Promise<void>;
}

export default function BrandForm({ initialData, onSave }: BrandFormProps) {
  const [form, setForm] = useState({
    agencyName: initialData?.agencyName ?? '',
    logoUrl: initialData?.logoUrl ?? '',
    primaryColor: initialData?.primaryColor ?? '#B8956A',
    supportEmail: initialData?.supportEmail ?? '',
    hidePoweredBy: initialData?.hidePoweredBy ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave?.(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="bf-agency" className="block text-sm text-fog mb-1">Agency name</label>
        <input
          id="bf-agency"
          type="text"
          value={form.agencyName}
          onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
          className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="bf-color" className="block text-sm text-fog mb-1">Primary color</label>
        <input
          id="bf-color"
          type="color"
          value={form.primaryColor}
          onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
          className="w-10 h-10 rounded cursor-pointer border border-mist"
        />
      </div>
      <div>
        <label htmlFor="bf-email" className="block text-sm text-fog mb-1">Support email</label>
        <input
          id="bf-email"
          type="email"
          value={form.supportEmail}
          onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
          className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.hidePoweredBy}
          onChange={(e) => setForm({ ...form, hidePoweredBy: e.target.checked })}
          className="w-4 h-4 accent-gold"
        />
        <span className="text-sm text-charcoal">Remove &quot;Powered by VelaBeam&quot;</span>
      </label>
      <BeamButton variant="primary" onClick={handleSubmit} loading={saving}>
        <Save size={16} /> Save
      </BeamButton>
    </div>
  );
}
