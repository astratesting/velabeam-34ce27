import { query } from './db';

export type ActivityType =
  | 'site.generated'
  | 'site.deployed'
  | 'site.paused'
  | 'site.error'
  | 'prospect.added'
  | 'prospect.dismissed'
  | 'prospect.generated'
  | 'invite.sent'
  | 'member.joined'
  | 'brand.updated'
  | 'billing.updated'
  | 'user.login'
  | 'user.signup';

export async function logActivity(params: {
  workspaceId: string;
  actorId: string;
  type: ActivityType;
  targetType?: string;
  targetId?: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  await query(
    `INSERT INTO activity_events (id, workspace_id, actor_id, type, target_type, target_id, payload, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
    [
      params.workspaceId,
      params.actorId,
      params.type,
      params.targetType ?? null,
      params.targetId ?? null,
      params.payload ? JSON.stringify(params.payload) : null,
    ]
  );
}

export async function getRecentActivity(workspaceId: string, limit: number = 20) {
  return query(
    `SELECT ae.*, u.name as actor_name, u.email as actor_email
     FROM activity_events ae
     LEFT JOIN users u ON u.id = ae.actor_id
     WHERE ae.workspace_id = $1
     ORDER BY ae.created_at DESC
     LIMIT $2`,
    [workspaceId, limit]
  );
}
