import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query, execute } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await query(
    `SELECT c.*, COUNT(s.id)::int as site_count
     FROM clients c
     LEFT JOIN sites s ON s.client_id = c.id
     WHERE c.workspace_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [session.user.workspaceId]
  );

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, notes } = body;

    if (!name) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO clients (id, workspace_id, name, owner_email, notes, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       RETURNING *`,
      [session.user.workspaceId, name, email ?? null, notes ?? null]
    );

    return NextResponse.json({ client: result[0] });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to create client.' }, { status: 500 });
  }
}
