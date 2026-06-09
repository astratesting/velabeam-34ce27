export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProspectScanRequest {
  lat: number;
  lng: number;
  radius: number;
  industries: string[];
}

export interface SiteGenerateRequest {
  prospectId?: string;
  name: string;
  industry: string;
  templateKey?: string;
}

export interface SiteDeployRequest {
  hostname: string;
}

export interface BrandUpdateRequest {
  agencyName?: string;
  logoUrl?: string;
  primaryColor?: string;
  supportEmail?: string;
  hidePoweredBy?: boolean;
}

export interface ClientCreateRequest {
  name: string;
  email?: string;
  notes?: string;
}
