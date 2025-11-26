import type { TenantMemberResponse } from '../../tenant-member/types/tenant-member-response.type.js';

export type TenantResponse = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status?: string;
  email?: string;
  phoneNumber?: string;
  phoneCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  locale?: string;
  maxUsers?: number;
  maxStorage?: number;
  maxApiCalls?: number;
  tenantMembers?: TenantMemberResponse[];
  createdAt?: string;
  updatedAt?: string;
};

