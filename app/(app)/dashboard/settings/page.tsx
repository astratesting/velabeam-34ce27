'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import { Save, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setProfile({ name: data.user.name ?? '', email: data.user.email ?? '' });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    // In dev, just show success
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="py-16 text-center text-fog">Loading...</div>;
  }

  return (
    <div className="animate-in">
      <PageHeader title="Settings" description="Manage your account and workspace settings." />

      {saved && (
        <div className="mb-6 p-3 rounded-md bg-gold/10 border border-gold/20 text-gold text-sm">
          Settings saved successfully.
        </div>
      )}

      <div className="max-w-2xl space-y-8">
        {/* Profile */}
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-name" className="block text-sm text-fog mb-1">Name</label>
              <input
                id="settings-name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className="block text-sm text-fog mb-1">Email</label>
              <input
                id="settings-email"
                type="email"
                value={profile.email}
                disabled
                className="w-full py-2.5 border-b border-mist bg-transparent text-fog/50 cursor-not-allowed"
              />
            </div>
            <BeamButton variant="primary" onClick={handleSaveProfile} loading={saving}>
              <Save size={16} /> Save profile
            </BeamButton>
          </div>
        </div>

        {/* Password */}
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">Change password</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-pw" className="block text-sm text-fog mb-1">Current password</label>
              <input
                id="current-pw"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="new-pw" className="block text-sm text-fog mb-1">New password</label>
              <input
                id="new-pw"
                type="password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="confirm-pw" className="block text-sm text-fog mb-1">Confirm new password</label>
              <input
                id="confirm-pw"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
              />
            </div>
            <BeamButton variant="secondary" size="sm">Update password</BeamButton>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-ivory border border-burgundy/20 rounded-lg p-6">
          <h2 className="font-display text-lg font-bold text-burgundy mb-4">Danger zone</h2>
          <p className="text-sm text-fog mb-4">
            Deleting your workspace will remove all sites, prospects, and client data. This action cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <BeamButton variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={16} /> Delete workspace
            </BeamButton>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-burgundy">Are you sure? This cannot be undone.</span>
              <BeamButton variant="danger" size="sm">Confirm delete</BeamButton>
              <BeamButton variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</BeamButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
