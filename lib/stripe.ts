import Stripe from 'stripe';
import { env } from './env';

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripe;
}

export function isStripeConfigured(): boolean {
  return !!env.STRIPE_SECRET_KEY;
}

export async function createCheckoutSession(params: {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  workspaceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null; error?: string }> {
  const s = getStripe();
  if (!s) return { url: null, error: 'Billing not configured' };

  try {
    const session = await s.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: params.customerId,
      customer_email: params.customerId ? undefined : params.customerEmail,
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { workspaceId: params.workspaceId },
    });
    return { url: session.url };
  } catch (e: any) {
    return { url: null, error: e.message };
  }
}

export async function createPortalSession(customerId: string, returnUrl: string): Promise<string | null> {
  const s = getStripe();
  if (!s) return null;

  const session = await s.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}
