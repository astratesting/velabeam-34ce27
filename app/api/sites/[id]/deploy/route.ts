import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { queryOne, execute } from '@/lib/db';
import { generateCnameTarget } from '@/lib/tokens';
import { logActivity } from '@/lib/activity';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { hostname } = body;

  if (!hostname) {
    return NextResponse.json({ error: 'Hostname is required.' }, { status: 400 });
  }

  // Verify site belongs to workspace
  const site = await queryOne(
    `SELECT * FROM sites WHERE id = $1 AND workspace_id = $2`,
    [id, session.user.workspaceId]
  );

  if (!site) {
    return NextResponse.json({ error: 'Site not found.' }, { status: 404 });
  }

  try {
    const cnameTarget = generateCnameTarget(id);

    // Create or update domain
    await execute(
      `INSERT INTO domains (id, site_id, hostname, cname_target, last_checked_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())
       ON CONFLICT (site_id) DO UPDATE SET hostname = EXCLUDED.hostname, cname_target = EXCLUDED.cname_target, verified_at = NULL, last_checked_at = NOW()`,
      [id, hostname, cnameTarget]
    );

    // Update site status
    await execute(
      `UPDATE sites SET status = 'pending_dns', updated_at = NOW() WHERE id = $1`,
      [id]
    );

    // Log activity
    await logActivity({
      workspaceId: session.user.workspaceId,
      actorId: session.user.id,
      type: 'site.deployed',
      targetType: 'site',
      targetId: id,
      payload: { hostname, cnameTarget },
    });

    return NextResponse.json({
      success: true,
      cnameTarget,
      instructions: `Add a CNAME record: ${hostname} → ${cnameTarget}`,
    });
  } catch (e: any) {
    console.error('Deploy error:', e);
    return NextResponse.json({ error: 'Failed to initiate deploy.' }, { status: 500 });
  }
}
