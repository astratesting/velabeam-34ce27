import { auth } from '@/auth';
import { query } from '@/lib/db';
import PageHeader from '@/components/ui/PageHeader';
import { formatDateTime } from '@/lib/format';

export default async function DeployPage() {
  const session = await auth();
  const workspaceId = session?.user?.workspaceId;

  const logs = await query(
    `SELECT ae.type, ae.payload, ae.created_at, ae.target_id, u.name as actor_name
     FROM activity_events ae
     LEFT JOIN users u ON u.id = ae.actor_id
     WHERE ae.workspace_id = $1
     ORDER BY ae.created_at DESC
     LIMIT 200`,
    [workspaceId]
  );

  return (
    <div className="animate-in">
      <PageHeader
        title="Deploy"
        description="Monitor your deploy pipeline and activity logs."
      />

      {/* Pipeline explanation */}
      <div className="bg-ivory border border-mist rounded-lg p-8 mb-8">
        <h2 className="font-display text-lg font-bold text-charcoal mb-4">How it works</h2>
        <div className="grid sm:grid-cols-4 gap-6">
          {[
            { num: '1', label: 'Discover', desc: 'Find prospects in your area' },
            { num: '2', label: 'Generate', desc: 'AI creates the website content' },
            { num: '3', label: 'Preview', desc: 'Review and customize the site' },
            { num: '4', label: 'Deploy', desc: 'Push to a custom domain' },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <span className="font-display text-3xl font-bold text-gold block mb-2">{step.num}</span>
              <h3 className="font-display text-sm font-bold text-charcoal mb-1">{step.label}</h3>
              <p className="text-xs text-fog">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-mist">
          <h2 className="font-display text-sm font-bold text-charcoal">Activity Log</h2>
        </div>
        {logs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-fog">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-mist bg-mist/10 sticky top-0">
                  <th className="text-left py-2 px-4 text-fog font-medium">Timestamp</th>
                  <th className="text-left py-2 px-4 text-fog font-medium">Type</th>
                  <th className="text-left py-2 px-4 text-fog font-medium">Actor</th>
                  <th className="text-left py-2 px-4 text-fog font-medium">Target</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any, idx: number) => (
                  <tr key={idx} className="border-b border-mist/30 hover:bg-mist/10">
                    <td className="py-2 px-4 text-fog">{formatDateTime(log.created_at)}</td>
                    <td className="py-2 px-4 text-charcoal">{log.type}</td>
                    <td className="py-2 px-4 text-fog">{log.actor_name ?? 'System'}</td>
                    <td className="py-2 px-4 text-fog">{log.target_id?.slice(0, 8) ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
