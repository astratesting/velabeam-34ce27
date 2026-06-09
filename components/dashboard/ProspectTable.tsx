'use client';

import DataTable from '@/components/ui/DataTable';
import StatusPill from '@/components/ui/StatusPill';
import BeamButton from '@/components/ui/BeamButton';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/format';
import { getIndustryLabel } from '@/lib/industry';
import { Radar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Prospect {
  id: string;
  name: string;
  industry: string;
  address: string;
  has_website: boolean;
  est_mrr_cents: number;
  status: string;
}

interface ProspectTableProps {
  prospects: Prospect[];
  onRefresh?: () => void;
}

export default function ProspectTable({ prospects, onRefresh }: ProspectTableProps) {
  return (
    <DataTable
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'industry', label: 'Industry', render: (row) => getIndustryLabel(row.industry) },
        { key: 'address', label: 'Address', className: 'text-xs text-fog' },
        {
          key: 'has_website',
          label: 'Has site?',
          render: (row) =>
            row.has_website ? (
              <span className="text-xs text-fog">Yes</span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-burgundy/10 text-burgundy border border-burgundy/20">
                No
              </span>
            ),
        },
        {
          key: 'est_mrr_cents',
          label: 'Est. MRR',
          align: 'right',
          render: (row) => formatCurrency(row.est_mrr_cents),
        },
        { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status as any} /> },
        {
          key: 'actions',
          label: '',
          render: (row) => (
            <Link href={`/dashboard/prospects/${row.id}`}>
              <BeamButton variant="ghost" size="sm">
                <ChevronRight size={16} />
              </BeamButton>
            </Link>
          ),
        },
      ]}
      data={prospects}
      emptyState={
        <EmptyState
          headline="No prospects in range"
          body="Increase your radius or refresh leads to find businesses in your area."
          action={{ label: 'Refresh leads', onClick: onRefresh }}
          icon={<Radar size={48} strokeWidth={1} />}
        />
      }
    />
  );
}
