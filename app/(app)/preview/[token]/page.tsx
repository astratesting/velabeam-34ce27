import { queryOne } from '@/lib/db';
import { notFound } from 'next/navigation';
import StudioRenderer from '@/components/studio/StudioRenderer';
import type { Site, BrandProfile, Workspace } from '@/types/db';

interface PreviewPageProps {
  params: Promise<{ token: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { token } = await params;

  const site = await queryOne<Site>(
    `SELECT s.*, bp.agency_name, bp.logo_url, bp.primary_color, bp.support_email, bp.hide_powered_by
     FROM sites s
     LEFT JOIN brand_profiles bp ON bp.workspace_id = s.workspace_id
     WHERE s.preview_token = $1`,
    [token]
  );

  if (!site) {
    notFound();
  }

  const content = site.content_json;
  const brand = {
    agencyName: (site as any).agency_name ?? 'VelaBeam',
    logoUrl: (site as any).logo_url ?? null,
    primaryColor: (site as any).primary_color ?? '#B8956A',
    supportEmail: (site as any).support_email ?? null,
    hidePoweredBy: (site as any).hide_powered_by ?? false,
  };

  return (
    <div style={{ '--brand-color': brand.primaryColor } as React.CSSProperties}>
      <StudioRenderer content={content} brand={brand} />
    </div>
  );
}
