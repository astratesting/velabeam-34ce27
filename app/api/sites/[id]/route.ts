import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { queryOne, execute } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const site = await queryOne(
    `SELECT s.*, c.name as client_name
     FROM sites s
     LEFT JOIN clients c ON c.id = s.client_id
     WHERE s.id = $1 AND s.workspace_id = $2`,
    [id, session.user.workspaceId]
  );

  if (!site) {
    return NextResponse.json({ error: 'Site not found.' }, { status: 404 });
  }

  // Get latest job
  const job = await queryOne(
    `SELECT * FROM generation_jobs WHERE site_id = $1 ORDER BY started_at DESC LIMIT 1`,
    [id]
  );

  return NextResponse.json({ site, job });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, status, clientId } = body;

  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (name !== undefined) {
    sets.push(`name = $${idx}`);
    values.push(name);
    idx++;
  }
  if (status !== undefined) {
    sets.push(`status = $${idx}`);
    values.push(status);
    idx++;
  }
  if (clientId !== undefined) {
    sets.push(`client_id = $${idx}`);
    values.push(clientId);
    idx++;
  }

  sets.push(`updated_at = NOW()`);

  values.push(id);
  values.push(session.user.workspaceId);

  const result = await execute(
    `UPDATE sites SET ${sets.join(', ')} WHERE id = $${idx} AND workspace_id = $${idx + 1}`,
    values
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Site not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const result = await execute(
    `DELETE FROM sites WHERE id = $1 AND workspace_id = $2`,
    [id, session.user.workspaceId]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Site not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
