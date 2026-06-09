import { formatDateTime } from '@/lib/format';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  siteId?: string;
}

interface DeployLogProps {
  logs: LogEntry[];
}

export default function DeployLog({ logs }: DeployLogProps) {
  if (logs.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-fog">No logs yet.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-mist bg-mist/10 sticky top-0">
            <th className="text-left py-2 px-4 text-fog font-medium">Timestamp</th>
            <th className="text-left py-2 px-4 text-fog font-medium">Level</th>
            <th className="text-left py-2 px-4 text-fog font-medium">Message</th>
            <th className="text-left py-2 px-4 text-fog font-medium">Site</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className="border-b border-mist/30 hover:bg-mist/10">
              <td className="py-2 px-4 text-fog">{formatDateTime(log.timestamp)}</td>
              <td className="py-2 px-4">
                <span className={log.level === 'error' ? 'text-burgundy' : 'text-fog'}>
                  {log.level}
                </span>
              </td>
              <td className="py-2 px-4 text-charcoal">{log.message}</td>
              <td className="py-2 px-4 text-fog">{log.siteId?.slice(0, 8) ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
