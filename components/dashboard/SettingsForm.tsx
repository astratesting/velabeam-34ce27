'use client';

import { useState } from 'react';
import BeamButton from '@/components/ui/BeamButton';
import { Save, Trash2 } from 'lucide-react';

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user.name ?? '');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-ivory border border-mist rounded-lg p-6">
        <h2 className="font-display text-lg font-bold text-charcoal mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="sf-name" className="block text-sm text-fog mb-1">Name</label>
            <input
              id="sf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="sf-email" className="block text-sm text-fog mb-1">Email</label>
            <input
              id="sf-email"
              type="email"
              value={user.email}
              disabled
              className="w-full py-2.5 border-b border-mist bg-transparent text-fog/50 cursor-not-allowed"
            />
          </div>
          <BeamButton variant="primary" onClick={handleSave} loading={saving}>
            <Save size={16} /> Save
          </BeamButton>
        </div>
      </div>

      <div className="bg-ivory border border-burgundy/20 rounded-lg p-6">
        <h2 className="font-display text-lg font-bold text-burgundy mb-4">Danger zone</h2>
        {!showDelete ? (
          <BeamButton variant="danger" size="sm" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} /> Delete workspace
          </BeamButton>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-burgundy">Are you sure? This cannot be undone.</span>
            <BeamButton variant="danger" size="sm">Confirm</BeamButton>
            <BeamButton variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</BeamButton>
          </div>
        )}
      </div>
    </div>
  );
}
