import { query, execute } from './db';

export async function verifyDnsRecord(hostname: string, expectedTarget: string): Promise<boolean> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${hostname}&type=CNAME`);
    if (!res.ok) return false;
    const data = await res.json();
    if (!data.Answer) return false;
    return data.Answer.some(
      (a: any) => a.type === 5 && a.data?.toLowerCase() === expectedTarget.toLowerCase()
    );
  } catch {
    return false;
  }
}

export async function checkPendingDomains(): Promise<void> {
  const domains = await query(
    `SELECT d.*, s.workspace_id
     FROM domains d
     JOIN sites s ON s.id = d.site_id
     WHERE d.verified_at IS NULL AND d.last_checked_at < NOW() - INTERVAL '5 minutes'`
  );

  for (const domain of domains) {
    try {
      const verified = await verifyDnsRecord(domain.hostname, domain.cname_target);

      await execute(
        `UPDATE domains SET last_checked_at = NOW(), verified_at = $1 WHERE id = $2`,
        [verified ? new Date().toISOString() : null, domain.id]
      );

      if (verified) {
        await execute(
          `UPDATE sites SET status = 'live', deployed_at = NOW() WHERE id = $1`,
          [domain.site_id]
        );
      }
    } catch (e: any) {
      await execute(
        `UPDATE domains SET last_checked_at = NOW(), last_error = $1 WHERE id = $2`,
        [e.message, domain.id]
      );
    }
  }
}
