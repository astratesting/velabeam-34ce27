'use client';

import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import { Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  owner_email: string | null;
  created_at: string;
  notes: string | null;
  site_count?: number;
}

interface ClientsTableProps {
  clients: Client[];
  onAdd?: () => void;
}

export default function ClientsTable({ clients, onAdd }: ClientsTableProps) {
  return (
    <DataTable
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'owner_email', label: 'Email' },
        { key: 'site_count', label: 'Sites', align: 'right' },
        { key: 'created_at', label: 'Created', mono: true, render: (row) => formatDate(row.created_at) },
        { key: 'notes', label: 'Notes', className: 'max-w-xs truncate text-fog text-xs' },
      ]}
      data={clients}
      emptyState={
        <EmptyState
          headline="No clients yet"
          body="Add your first client to start managing their sites."
          action={onAdd ? { label: 'Add client', onClick: onAdd } : undefined}
          icon={<Users size={48} strokeWidth={1} />}
        />
      }
    />
  );
}
