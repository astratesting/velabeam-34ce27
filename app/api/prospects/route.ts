import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspaceId = session.user.workspaceId;
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const search = searchParams.get('search');
  const industry = searchParams.get('industry');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '50');

  let sql = 'SELECT * FROM prospects WHERE workspace_id = $1';
  const params: any[] = [workspaceId];
  let paramIdx = 2;

  if (id) {
    sql += ` AND id = $${paramIdx}`;
    params.push(id);
    paramIdx++;
  }

  if (search) {
    sql += ` AND LOWER(name) LIKE $${paramIdx}`;
    params.push(`%${search.toLowerCase()}%`);
    paramIdx++;
  }

  if (industry) {
    const industries = industry.split(',');
    sql += ` AND industry = ANY($${paramIdx})`;
    params.push(industries);
    paramIdx++;
  }

  if (status) {
    sql += ` AND status = $${paramIdx}`;
    params.push(status);
    paramIdx++;
  }

  // Count
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)::int as count');
  const countResult = await query(countSql, params);
  const total = countResult[0]?.count ?? 0;

  // Paginate
  sql += ` ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
  params.push(pageSize, (page - 1) * pageSize);

  const items = await query(sql, params);

  return NextResponse.json({ items, total, page, pageSize });
}
