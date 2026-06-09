import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query, execute } from '@/lib/db';
import { scanProspects } from '@/lib/places';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { estimateMRR, type IndustryKey } from '@/lib/industry';
import { logActivity } from '@/lib/activity';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit
  const rl = rateLimit(getRateLimitKey(req, 'scan'), 3, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many scan requests. Wait a moment.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { lat, lng, radius, industries } = body;

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Location (lat, lng) is required.' }, { status: 400 });
    }

    const workspaceId = session.user.workspaceId;
    const selectedIndustries: IndustryKey[] = industries ?? ['restaurant', 'dental', 'legal', 'salon'];

    const result = await scanProspects({
      lat: Number(lat),
      lng: Number(lng),
      radiusMeters: Number(radius) || 40000,
      industries: selectedIndustries,
    });

    let inserted = 0;
    for (const p of result.prospects) {
      try {
        await execute(
          `INSERT INTO prospects (id, workspace_id, external_place_id, name, industry, address, lat, lng, phone, website_url, has_website, rating, review_count, est_mrr_cents, status, last_seen_at, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'new', NOW(), NOW())
           ON CONFLICT (workspace_id, external_place_id) DO UPDATE SET
             name = EXCLUDED.name,
             rating = EXCLUDED.rating,
             review_count = EXCLUDED.review_count,
             last_seen_at = NOW()`,
          [
            workspaceId,
            p.externalPlaceId,
            p.name,
            p.industry,
            p.address,
            p.lat,
            p.lng,
            p.phone,
            p.websiteUrl,
            !p.websiteUrl,
            p.rating,
            p.reviewCount,
            estimateMRR(p.industry, p.reviewCount, p.rating ?? 0),
          ]
        );
        inserted++;
      } catch {
        // Skip duplicates
      }
    }

    // Log activity
    await logActivity({
      workspaceId,
      actorId: session.user.id,
      type: 'prospect.added',
      payload: { count: inserted, industries: selectedIndustries },
    });

    return NextResponse.json({
      inserted,
      totalFound: result.totalFound,
      message: `${inserted} prospects added.`,
    });
  } catch (e: any) {
    console.error('Scan error:', e);
    return NextResponse.json({ error: 'Scan failed. Check your configuration.' }, { status: 500 });
  }
}
