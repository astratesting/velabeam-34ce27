'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Eye, Code, Activity, CreditCard, Settings } from 'lucide-react';

const tabs = [
  { key: 'preview', label: 'Preview', icon: Eye },
  { key: 'editor', label: 'Editor', icon: Code },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
] as const;

interface SiteDetailTabsProps {
  siteId: string;
  previewToken?: string;
  defaultTab?: string;
}

export default function SiteDetailTabs({ siteId, previewToken, defaultTab = 'preview' }: SiteDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      <div className="border-b border-mist mb-6">
        <nav className="flex gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b-2',
                  activeTab === tab.key
                    ? 'border-gold text-charcoal font-medium'
                    : 'border-transparent text-fog hover:text-charcoal'
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'preview' && previewToken && (
        <iframe
          src={`/preview/${previewToken}`}
          className="w-full h-[600px] border border-mist rounded-lg"
          title="Site preview"
        />
      )}
      {activeTab === 'editor' && (
        <div className="bg-ivory border border-mist rounded-lg p-12 text-center">
          <p className="font-display text-lg text-charcoal mb-2">Visual editor</p>
          <p className="text-sm text-fog">Coming in a future update.</p>
        </div>
      )}
      {activeTab === 'activity' && (
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <p className="text-sm text-fog text-center py-8">No activity recorded yet.</p>
        </div>
      )}
      {activeTab === 'billing' && (
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <p className="text-sm text-fog text-center py-8">No billing data.</p>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="bg-ivory border border-mist rounded-lg p-6">
          <p className="text-sm text-fog text-center py-8">Site settings.</p>
        </div>
      )}
    </div>
  );
}
