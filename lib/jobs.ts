import { query, execute, queryOne } from './db';
import { generateSiteContent } from './llm';
import { generatePreviewToken, generateSlug } from './tokens';
import { logActivity } from './activity';

export type { JobStep, JobStatus } from './job-types';
export { STEP_LABELS } from './job-types';
import type { JobStep, JobStatus } from './job-types';

export async function createGenerationJob(siteId: string): Promise<string> {
  const result = await query<{ id: string }>(
    `INSERT INTO generation_jobs (id, site_id, status, step, progress, started_at)
     VALUES (gen_random_uuid(), $1, 'queued', 'analyze', 0, NOW())
     RETURNING id`,
    [siteId]
  );
  return result[0].id;
}

export async function runGenerationJob(jobId: string): Promise<void> {
  const job = await queryOne<{
    id: string;
    site_id: string;
    status: string;
  }>(`SELECT * FROM generation_jobs WHERE id = $1`, [jobId]);

  if (!job) return;

  const site = await queryOne<{
    id: string;
    name: string;
    industry: string;
    prospect_id: string;
    workspace_id: string;
  }>(`SELECT * FROM sites WHERE id = $1`, [job.site_id]);

  if (!site) return;

  const prospect = site.prospect_id
    ? await queryOne<{ name: string; address: string; phone: string | null }>(
        `SELECT name, address, phone FROM prospects WHERE id = $1`,
        [site.prospect_id]
      )
    : null;

  try {
    await execute(
      `UPDATE generation_jobs SET status = 'running', step = 'analyze', progress = 10 WHERE id = $1`,
      [jobId]
    );

    // Step 1: Analyze
    await delay(1000);
    await execute(
      `UPDATE generation_jobs SET step = 'copy', progress = 30 WHERE id = $1`,
      [jobId]
    );

    // Step 2: Generate copy
    const content = await generateSiteContent({
      businessName: prospect?.name ?? site.name,
      industry: site.industry as any,
      address: prospect?.address ?? '',
      phone: prospect?.phone,
    });

    await execute(
      `UPDATE generation_jobs SET step = 'sections', progress = 60 WHERE id = $1`,
      [jobId]
    );

    // Step 3: Compose sections
    await delay(1000);
    await execute(
      `UPDATE generation_jobs SET step = 'publish', progress = 80 WHERE id = $1`,
      [jobId]
    );

    // Step 4: Publish
    await execute(
      `UPDATE sites SET content_json = $1, slug = $2, preview_token = $3, status = 'draft', updated_at = NOW() WHERE id = $4`,
      [JSON.stringify(content), generateSlug(prospect?.name ?? site.name), generatePreviewToken(), site.id]
    );

    await execute(
      `UPDATE generation_jobs SET status = 'succeeded', progress = 100, finished_at = NOW() WHERE id = $1`,
      [jobId]
    );

    // Log activity
    await logActivity({
      workspaceId: site.workspace_id,
      actorId: 'system',
      type: 'site.generated',
      targetType: 'site',
      targetId: site.id,
    });
  } catch (e: any) {
    await execute(
      `UPDATE generation_jobs SET status = 'failed', error = $1, finished_at = NOW() WHERE id = $2`,
      [e.message, jobId]
    );

    await execute(
      `UPDATE sites SET status = 'error', updated_at = NOW() WHERE id = $1`,
      [site.id]
    );
  }
}

export async function getJobBySiteId(siteId: string) {
  return queryOne(
    `SELECT * FROM generation_jobs WHERE site_id = $1 ORDER BY started_at DESC LIMIT 1`,
    [siteId]
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
