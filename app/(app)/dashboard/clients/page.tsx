'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import { Users, Plus } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data.items ?? []);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!newName) return;
    setSaving(true);
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, notes: newNotes }),
      });
      setShowModal(false);
      setNewName('');
      setNewEmail('');
      setNewNotes('');
      await fetchClients();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in">
      <PageHeader
        title="Clients"
        description="Manage your client relationships."
        actions={
          <BeamButton variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add client
          </BeamButton>
        }
      />

      {loading ? (
        <div className="py-16 text-center text-fog">Loading clients...</div>
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'owner_email', label: 'Email' },
            { key: 'created_at', label: 'Created', mono: true, render: (row) => formatDate(row.created_at) },
            { key: 'notes', label: 'Notes', className: 'max-w-xs truncate' },
          ]}
          data={clients}
          emptyState={
            <EmptyState
              headline="No clients yet"
              body="Add your first client to start managing their sites."
              action={{ label: 'Add client', onClick: () => setShowModal(true) }}
              icon={<Users size={48} strokeWidth={1} />}
            />
          }
        />
      )}

      {/* Add client modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm">
          <div className="bg-ivory rounded-lg border border-mist p-8 max-w-md w-full mx-4">
            <h2 className="font-display text-xl font-bold text-charcoal mb-6">Add client</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="client-name" className="block text-sm text-fog mb-1">Name</label>
                <input
                  id="client-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
                  placeholder="Client name"
                />
              </div>
              <div>
                <label htmlFor="client-email" className="block text-sm text-fog mb-1">Email</label>
                <input
                  id="client-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label htmlFor="client-notes" className="block text-sm text-fog mb-1">Notes</label>
                <textarea
                  id="client-notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal focus:border-gold focus:outline-none resize-none"
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <BeamButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</BeamButton>
              <BeamButton variant="primary" onClick={handleAddClient} loading={saving} disabled={!newName}>
                Add client
              </BeamButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
