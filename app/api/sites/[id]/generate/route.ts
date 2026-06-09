import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { queryOne } from '@/lib/db';
import { createGenerationJob, runGenerationJob } from '@/lib/jobs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify site belongs to workspace
  const site = await queryOne(
    `SELECT * FROM sites WHERE id = $1 AND workspace_id = $2`,
    [id, session.user.workspaceId]
  );

  if (!site) {
    return NextResponse.json({ error: 'Site not found.' }, { status: 404 });
  }

  try {
    const jobId = await createGenerationJob(id);

    // Run generation in background (fire and forget for dev)
    runGenerationJob(jobId).catch(console.error);

    return NextResponse.json({ jobId, message: 'Generation started.' });
  } catch (e: any) {
    console.error('Generation error:', e);
    return NextResponse.json({ error: 'Failed to start generation.' }, { status: 500 });
  }
}
