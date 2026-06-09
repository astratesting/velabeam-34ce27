import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query, execute } from '@/lib/db';
import { generatePreviewToken, generateSlug } from '@/lib/tokens';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspaceId = session.user.workspaceId;
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status');
  const industry = searchParams.get('industry');

  let sql = 'SELECT * FROM sites WHERE workspace_id = $1';
  const params: any[] = [workspaceId];
  let paramIdx = 2;

  if (status) {
    sql += ` AND status = $${paramIdx}`;
    params.push(status);
    paramIdx++;
  }

  if (industry) {
    sql += ` AND industry = $${paramIdx}`;
    params.push(industry);
    paramIdx++;
  }

  sql += ' ORDER BY created_at DESC';

  const items = await query(sql, params);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { prospectId, name, industry, templateKey, clientId } = body;

    if (!name || !industry) {
      return NextResponse.json({ error: 'Name and industry are required.' }, { status: 400 });
    }

    const workspaceId = session.user.workspaceId;
    const previewToken = generatePreviewToken();
    const slug = generateSlug(name);

    const result = await query(
      `INSERT INTO sites (id, workspace_id, client_id, prospect_id, industry, template_key, name, slug, status, preview_token, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'draft', $8, NOW(), NOW())
       RETURNING *`,
      [workspaceId, clientId ?? null, prospectId ?? null, industry, templateKey ?? industry, name, slug, previewToken]
    );

    const site = result[0];

    // Update prospect status if linked
    if (prospectId) {
      await execute(
        `UPDATE prospects SET status = 'generated' WHERE id = $1 AND workspace_id = $2`,
        [prospectId, workspaceId]
      );
    }

    return NextResponse.json({ site });
  } catch (e: any) {
    console.error('Site creation error:', e);
    return NextResponse.json({ error: 'Failed to create site.' }, { status: 500 });
  }
}
