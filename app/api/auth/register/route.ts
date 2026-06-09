import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { transaction, queryOne } from '@/lib/db';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  // Rate limit
  const rl = rateLimit(getRateLimitKey(req, 'register'), 5, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  try {
    const { name, email, password, workspaceName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user exists
    const existing = await queryOne('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + workspace + membership in one transaction
    const result = await transaction(async (client) => {
      const userResult = await client.query(
        `INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
         RETURNING id, email, name`,
        [normalizedEmail, passwordHash, name || null]
      );
      const user = userResult.rows[0];

      const wsResult = await client.query(
        `INSERT INTO workspaces (id, name, owner_id, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
         RETURNING id`,
        [workspaceName || `${name || 'My'}'s Studio`, user.id]
      );
      const workspace = wsResult.rows[0];

      await client.query(
        `INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
         VALUES ($1, $2, 'owner', NOW())`,
        [workspace.id, user.id]
      );

      // Create default brand profile
      await client.query(
        `INSERT INTO brand_profiles (workspace_id, agency_name, primary_color, updated_at)
         VALUES ($1, $2, '#B8956A', NOW())`,
        [workspace.id, workspaceName || `${name || 'My'} Studio`]
      );

      return { user, workspace };
    });

    return NextResponse.json({
      user: { id: result.user.id, email: result.user.email, name: result.user.name },
      workspaceId: result.workspace.id,
    });
  } catch (e: any) {
    console.error('Registration error:', e);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
