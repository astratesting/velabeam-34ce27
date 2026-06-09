import { auth } from '@/auth';
import { query } from '@/lib/db';
import { formatCurrency } from '@/lib/format';
import SerifKPI from '@/components/ui/SerifKPI';
import PageHeader from '@/components/ui/PageHeader';
import BeamButton from '@/components/ui/BeamButton';
import StatusPill from '@/components/ui/StatusPill';
import DataTable from '@/components/ui/DataTable';
import { timeAgo } from '@/lib/format';
import { getIndustryLabel } from '@/lib/industry';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  const workspaceId = session?.user?.workspaceId;

  // KPI data
  const [sitesCount, prospectsCount, pipelineResult] = await Promise.all([
    query(`SELECT COUNT(*)::int as count FROM sites WHERE workspace_id = $1`, [workspaceId]),
    query(`SELECT COUNT(*)::int as count FROM prospects WHERE workspace_id = $1 AND status = 'new'`, [workspaceId]),
    query(`SELECT COALESCE(SUM(est_mrr_cents), 0)::int as total FROM prospects WHERE workspace_id = $1 AND status IN ('new', 'queued')`, [workspaceId]),
  ]);

  const sitesLive = await query(
    `SELECT COUNT(*)::int as count FROM sites WHERE workspace_id = $1 AND status = 'live'`,
    [workspaceId]
  );

  const deploysThisWeek = await query(
    `SELECT COUNT(*)::int as count FROM sites WHERE workspace_id = $1 AND deployed_at > NOW() - INTERVAL '7 days'`,
    [workspaceId]
  );

  // Recent prospects
  const prospects = await query(
    `SELECT * FROM prospects WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 5`,
    [workspaceId]
  );

  // Recent activity
  const activity = await query(
    `SELECT ae.*, u.name as actor_name FROM activity_events ae
     LEFT JOIN users u ON u.id = ae.actor_id
     WHERE ae.workspace_id = $1 ORDER BY ae.created_at DESC LIMIT 10`,
    [workspaceId]
  );

  // Recent sites
  const recentSites = await query(
    `SELECT * FROM sites WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 3`,
    [workspaceId]
  );

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="animate-in">
      <PageHeader
        eyebrow={`TODAY · ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
        title={`${greeting}, ${firstName}`}
        actions={
          <Link href="/dashboard/prospects">
            <BeamButton variant="primary">
              <Plus size={16} /> Generate next site
            </BeamButton>
          </Link>
        }
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SerifKPI
          value={formatCurrency(pipelineResult[0]?.total ?? 0)}
          label="Pipeline value"
        />
        <SerifKPI
          value={sitesLive[0]?.count ?? 0}
          label="Sites live"
        />
        <SerifKPI
          value={prospectsCount[0]?.count ?? 0}
          label="Prospects queued"
        />
        <SerifKPI
          value={deploysThisWeek[0]?.count ?? 0}
          label="Deploys this week"
        />
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Prospects table */}
        <div className="lg:col-span-8">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">Next 5 prospects</h2>
          <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
            <DataTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'industry', label: 'Industry', render: (row) => getIndustryLabel(row.industry) },
                { key: 'est_mrr_cents', label: 'Est. MRR', align: 'right', render: (row) => formatCurrency(row.est_mrr_cents) },
                { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                {
                  key: 'actions',
                  label: '',
                  render: (row) => (
                    <Link href={`/dashboard/prospects/${row.id}`}>
                      <BeamButton variant="ghost" size="sm">Generate</BeamButton>
                    </Link>
                  ),
                },
              ]}
              data={prospects}
              emptyState={
                <div className="py-12 text-center">
                  <p className="font-display text-lg text-charcoal mb-2">No prospects yet</p>
                  <p className="text-sm text-fog mb-4">Complete onboarding to discover businesses in your area.</p>
                  <Link href="/onboarding">
                    <BeamButton variant="primary">Start onboarding</BeamButton>
                  </Link>
                </div>
              }
            />
          </div>
        </div>

        {/* Right: Activity feed */}
        <div className="lg:col-span-4">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">Activity</h2>
          <div className="bg-ivory border border-mist rounded-lg p-4">
            {activity.length === 0 ? (
              <p className="text-sm text-fog py-4 text-center">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {activity.map((event: any) => (
                  <div key={event.id} className="flex gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-charcoal">
                        <span className="text-fog">{event.type.replace('.', ' ')}</span>
                      </p>
                      <p className="text-xs text-fog">{timeAgo(event.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent sites */}
      {recentSites.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">Recently generated</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentSites.map((site: any) => (
              <Link
                key={site.id}
                href={`/dashboard/sites/${site.id}`}
                className="flex-shrink-0 w-80 bg-ivory border border-mist rounded-lg overflow-hidden hover:border-gold transition-colors"
              >
                <div className="h-40 bg-mist/30 flex items-center justify-center">
                  <span className="text-fog text-sm">Preview</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-charcoal">{site.name}</span>
                    <StatusPill status={site.status} />
                  </div>
                  <span className="text-xs text-fog font-mono">{getIndustryLabel(site.industry)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
