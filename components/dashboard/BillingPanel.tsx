import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/format';
import { CreditCard } from 'lucide-react';

interface BillingPanelProps {
  subscription?: {
    product: string;
    status: string;
    current_period_end?: string;
  } | null;
  invoices?: Array<{
    id: string;
    amount_cents: number;
    status: string;
    issued_at: string;
    pdf_url?: string | null;
  }>;
  configured: boolean;
}

export default function BillingPanel({ subscription, invoices, configured }: BillingPanelProps) {
  if (!configured) {
    return (
      <EmptyState
        headline="Billing not configured"
        body="Stripe integration is not set up. Configure STRIPE_SECRET_KEY in your environment."
        icon={<CreditCard size={48} strokeWidth={1} />}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Current plan */}
      <div className="bg-ivory border border-mist rounded-lg p-6">
        <h3 className="font-display text-lg font-bold text-charcoal mb-4">Current Plan</h3>
        {subscription ? (
          <div>
            <p className="font-display text-2xl font-bold text-charcoal capitalize">{subscription.product}</p>
            <p className="text-sm text-fog">Status: {subscription.status}</p>
            {subscription.current_period_end && (
              <p className="text-xs text-fog mt-1">Renews {formatDate(subscription.current_period_end)}</p>
            )}
          </div>
        ) : (
          <p className="text-fog">No active subscription.</p>
        )}
      </div>

      {/* Invoices */}
      {invoices && invoices.length > 0 && (
        <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-mist">
            <h3 className="font-display text-sm font-bold text-charcoal">Invoices</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left py-2 px-6 text-xs text-fog">Date</th>
                <th className="text-right py-2 px-6 text-xs text-fog">Amount</th>
                <th className="text-left py-2 px-6 text-xs text-fog">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-mist/50">
                  <td className="py-2 px-6 font-mono text-xs">{formatDate(inv.issued_at)}</td>
                  <td className="py-2 px-6 text-right font-mono text-xs">{formatCurrency(inv.amount_cents)}</td>
                  <td className="py-2 px-6 capitalize">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
