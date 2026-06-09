import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isStripeConfigured, createCheckoutSession } from '@/lib/stripe';
import { queryOne } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Billing not configured.' }, { status: 501 });
  }

  try {
    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required.' }, { status: 400 });
    }

    const workspace = await queryOne(
      `SELECT * FROM workspaces WHERE id = $1`,
      [session.user.workspaceId]
    );

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    const result = await createCheckoutSession({
      priceId,
      customerId: workspace.stripe_customer_id ?? undefined,
      customerEmail: session.user.email,
      workspaceId: workspace.id,
      successUrl: `${origin}/dashboard/billing?success=true`,
      cancelUrl: `${origin}/dashboard/billing?canceled=true`,
    });

    if (!result.url) {
      return NextResponse.json({ error: result.error ?? 'Checkout failed.' }, { status: 500 });
    }

    return NextResponse.json({ url: result.url });
  } catch (e: any) {
    return NextResponse.json({ error: 'Checkout failed.' }, { status: 500 });
  }
}
