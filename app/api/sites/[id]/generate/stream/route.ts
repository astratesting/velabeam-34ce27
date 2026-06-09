import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { queryOne } from '@/lib/db';
import { getJobBySiteId, type JobStep, type JobStatus } from '@/lib/jobs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await params;

  // Verify site belongs to workspace
  const site = await queryOne(
    `SELECT * FROM sites WHERE id = $1 AND workspace_id = $2`,
    [id, session.user.workspaceId]
  );

  if (!site) {
    return new Response('Not found', { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Poll for job status
      const poll = async () => {
        const job = await getJobBySiteId(id);
        if (!job) {
          send({ status: 'no_job' });
          controller.close();
          return;
        }

        send({
          status: job.status,
          step: job.step,
          progress: job.progress,
          error: job.error,
        });

        if (job.status === 'succeeded' || job.status === 'failed') {
          controller.close();
          return;
        }

        // Poll again in 1 second
        setTimeout(poll, 1000);
      };

      await poll();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
