import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { queryOne, execute } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const brand = await queryOne(
    `SELECT * FROM brand_profiles WHERE workspace_id = $1`,
    [session.user.workspaceId]
  );

  return NextResponse.json({ brand });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { agencyName, logoUrl, primaryColor, supportEmail, hidePoweredBy } = body;

    const sets: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (agencyName !== undefined) {
      sets.push(`agency_name = $${idx}`);
      values.push(agencyName);
      idx++;
    }
    if (logoUrl !== undefined) {
      sets.push(`logo_url = $${idx}`);
      values.push(logoUrl);
      idx++;
    }
    if (primaryColor !== undefined) {
      sets.push(`primary_color = $${idx}`);
      values.push(primaryColor);
      idx++;
    }
    if (supportEmail !== undefined) {
      sets.push(`support_email = $${idx}`);
      values.push(supportEmail);
      idx++;
    }
    if (hidePoweredBy !== undefined) {
      sets.push(`hide_powered_by = $${idx}`);
      values.push(hidePoweredBy);
      idx++;
    }

    sets.push(`updated_at = NOW()`);

    values.push(session.user.workspaceId);

    if (sets.length > 1) {
      // Try update first, insert if not exists
      const result = await execute(
        `UPDATE brand_profiles SET ${sets.join(', ')} WHERE workspace_id = $${idx}`,
        values
      );

      if (result.rowCount === 0) {
        // Insert
        await execute(
          `INSERT INTO brand_profiles (workspace_id, agency_name, primary_color, updated_at)
           VALUES ($1, $2, '#B8956A', NOW())`,
          [session.user.workspaceId, agencyName ?? 'My Studio']
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Brand update error:', e);
    return NextResponse.json({ error: 'Failed to update brand.' }, { status: 500 });
  }
}
