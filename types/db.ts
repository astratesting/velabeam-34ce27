export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  plan: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  invited_by: string | null;
  joined_at: string;
}

export interface BrandProfile {
  workspace_id: string;
  agency_name: string;
  logo_url: string | null;
  primary_color: string;
  support_email: string | null;
  hide_powered_by: boolean;
  updated_at: string;
}

export interface Prospect {
  id: string;
  workspace_id: string;
  external_place_id: string;
  name: string;
  industry: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  website_url: string | null;
  has_website: boolean;
  rating: number | null;
  review_count: number;
  est_mrr_cents: number;
  status: 'new' | 'queued' | 'generated' | 'dismissed';
  last_seen_at: string;
  created_at: string;
}

export interface Client {
  id: string;
  workspace_id: string;
  name: string;
  owner_email: string | null;
  notes: string | null;
  created_at: string;
}

export interface Site {
  id: string;
  workspace_id: string;
  client_id: string | null;
  prospect_id: string | null;
  industry: string;
  template_key: string;
  name: string;
  slug: string;
  status: 'draft' | 'pending_dns' | 'live' | 'paused' | 'error';
  content_json: any;
  preview_token: string;
  created_at: string;
  updated_at: string;
  deployed_at: string | null;
}

export interface Domain {
  id: string;
  site_id: string;
  hostname: string;
  cname_target: string;
  verified_at: string | null;
  last_checked_at: string | null;
  last_error: string | null;
}

export interface GenerationJob {
  id: string;
  site_id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  step: string;
  progress: number;
  error: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface Subscription {
  workspace_id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_end: string;
  price_id: string;
  product: 'agency' | 'hosting';
}

export interface Invoice {
  id: string;
  workspace_id: string;
  stripe_invoice_id: string;
  amount_cents: number;
  currency: string;
  status: string;
  pdf_url: string | null;
  issued_at: string;
}

export interface ActivityEvent {
  id: string;
  workspace_id: string;
  actor_id: string;
  type: string;
  target_type: string | null;
  target_id: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}
