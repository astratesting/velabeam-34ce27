import { NextResponse } from 'next/server';
import { checkPendingDomains } from '@/lib/dns';

export async function GET() {
  try {
    await checkPendingDomains();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
