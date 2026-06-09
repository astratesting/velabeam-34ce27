'use client';

import { Map } from 'lucide-react';

interface ProspectMapProps {
  prospects: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    industry: string;
  }>;
}

export default function ProspectMap({ prospects }: ProspectMapProps) {
  return (
    <div className="bg-ink rounded-lg h-[500px] flex items-center justify-center">
      <div className="text-center">
        <Map size={48} className="text-gold mx-auto mb-4" strokeWidth={1} />
        <p className="text-ivory/60 text-sm">Map view requires MapLibre configuration.</p>
        <p className="text-ivory/40 text-xs mt-1">
          Set NEXT_PUBLIC_MAP_TILE_URL in your environment.
        </p>
        {prospects.length > 0 && (
          <p className="text-ivory/30 text-xs mt-4">{prospects.length} prospects to display</p>
        )}
      </div>
    </div>
  );
}
