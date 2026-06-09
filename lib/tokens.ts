import crypto from 'crypto';

export function generateToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function generatePreviewToken(): string {
  return `pv_${generateToken(24)}`;
}

export function generateInviteToken(): string {
  return `inv_${generateToken(24)}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63);
}

export function generateCnameTarget(siteId: string): string {
  return `vb-${siteId.slice(0, 8)}.velabeam.app`;
}
