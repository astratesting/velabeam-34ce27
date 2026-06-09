import SerifKPI from '@/components/ui/SerifKPI';
import { formatCurrency } from '@/lib/format';

interface TodayViewProps {
  pipelineValue: number;
  sitesLive: number;
  prospectsQueued: number;
  deploysThisWeek: number;
}

export default function TodayView({
  pipelineValue,
  sitesLive,
  prospectsQueued,
  deploysThisWeek,
}: TodayViewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SerifKPI value={formatCurrency(pipelineValue)} label="Pipeline value" />
      <SerifKPI value={sitesLive} label="Sites live" />
      <SerifKPI value={prospectsQueued} label="Prospects queued" />
      <SerifKPI value={deploysThisWeek} label="Deploys this week" />
    </div>
  );
}
