import { auth } from '@/auth';
import { query } from '@/lib/db';
import { isStripeConfigured } from '@/lib/stripe';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/format';
import { CreditCard } from 'lucide-react';

export default async function BillingPage() {
  const session = await auth();
  const workspaceId = session?.user?.workspaceId;
  const configured = isStripeConfigured();

  const subscription = await query(
    `SELECT * FROM subscriptions WHERE workspace_id = $1`,
    [workspaceId]
  );

  const invoices = await query(
    `SELECT * FROM invoices WHERE workspace_id = $1 ORDER BY issued_at DESC LIMIT 20`,
    [workspaceId]
  );

  if (!configured) {
    return (
      <div className="animate-in">
        <PageHeader title="Billing" description="Manage your subscription and invoices." />
        <EmptyState
          headline="Billing not configured"
          body="Stripe integration is not set up. Configure STRIPE_SECRET_KEY in your environment to enable billing."
          icon={<CreditCard size={48} strokeWidth={1} />}
        />
      </div>
    );
  }

  const sub = subscription[0];

  return (
    <div className="animate-in">
      <PageHeader title="Billing" description="Manage your subscription and invoices." />

      {/* Current plan */}
      <div className="bg-ivory border border-mist rounded-lg p-6 mb-8">
        <h2 className="font-display text-lg font-bold text-charcoal mb-4">Current Plan</h2>
        {sub ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-2xl font-bold text-charcoal capitalize">{sub.product} Plan</p>
              <p className="text-sm text-fog">Status: {sub.status}</p>
              {sub.current_period_end && (
                <p className="text-xs text-fog mt-1">Renews {formatDate(sub.current_period_end)}</p>
              )}
            </div>
            <a href="/pricing">
              <button className="px-4 py-2 border border-gold text-gold rounded-md text-sm hover:bg-gold/5 transition-colors">
                Upgrade
              </button>
            </a>
          </div>
        ) : (
          <div>
            <p className="text-fog mb-4">No active subscription.</p>
            <a href="/pricing">
              <button className="px-4 py-2 bg-gold text-ivory rounded-md text-sm hover:bg-gold-hover transition-colors">
                View plans
              </button>
            </a>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-ivory border border-mist rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-mist">
          <h2 className="font-display text-lg font-bold text-charcoal">Invoices</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-fog">No invoices yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left py-3 px-6 text-xs text-fog uppercase">Date</th>
                <th className="text-right py-3 px-6 text-xs text-fog uppercase">Amount</th>
                <th className="text-left py-3 px-6 text-xs text-fog uppercase">Status</th>
                <th className="text-right py-3 px-6 text-xs text-fog uppercase">PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="border-b border-mist/50">
                  <td className="py-3 px-6 font-mono text-xs">{formatDate(inv.issued_at)}</td>
                  <td className="py-3 px-6 text-right font-mono text-xs">{formatCurrency(inv.amount_cents)}</td>
                  <td className="py-3 px-6 capitalize">{inv.status}</td>
                  <td className="py-3 px-6 text-right">
                    {inv.pdf_url ? (
                      <a href={inv.pdf_url} className="text-gold text-xs hover:underline" target="_blank" rel="noopener">
                        Download
                      </a>
                    ) : (
                      <span className="text-fog text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
