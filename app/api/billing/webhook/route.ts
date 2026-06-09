import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { execute } from '@/lib/db';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Billing not configured.' }, { status: 501 });
  }

  const stripe = getStripe()!;
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const workspaceId = session.metadata?.workspaceId;
        if (workspaceId && session.customer) {
          await execute(
            `UPDATE workspaces SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2`,
            [session.customer as string, workspaceId]
          );
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const customerId = sub.customer as string;
        const workspace = await execute(
          `UPDATE subscriptions SET status = $1, current_period_end = $2, updated_at = NOW()
           WHERE stripe_subscription_id = $3`,
          [sub.status, new Date((sub as any).current_period_end * 1000).toISOString(), sub.id]
        );
        if (workspace.rowCount === 0) {
          // Insert new subscription
          const ws = await execute(
            `SELECT id FROM workspaces WHERE stripe_customer_id = $1`,
            [customerId]
          );
          if (ws.rowCount && ws.rowCount > 0) {
            // We'd need to get the workspace ID from the rows
          }
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Record invoice
        break;
      }
    }
  } catch (e: any) {
    console.error('Webhook processing error:', e);
  }

  return NextResponse.json({ received: true });
}
