import type {
  FindByCriteriaInput,
  PaginatedResult,
} from '@/shared/types/index';

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

export type TenantMemberResponse = {
  id: string;
  tenantId?: string;
  userId?: string;
  role?: string;
};

export type TenantMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

export type TenantCreateInput = {
  name: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
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
};

export type TenantUpdateInput = {
  id: string;
  name?: string;
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
  locale?: number | string;
  maxUsers?: string;
  maxStorage?: number;
  maxApiCalls?: number;
};

export type TenantDeleteInput = {
  id: string;
};

export type TenantFindByCriteriaInput = FindByCriteriaInput;
export type PaginatedTenantResult = PaginatedResult<TenantResponse>;

// Tenant Member types
export type TenantMemberAddInput = {
  tenantId: string;
  userId?: string;
  role: TenantMemberRole;
};

export type TenantMemberUpdateInput = {
  id: string;
  role?: TenantMemberRole;
};

export type TenantMemberRemoveInput = {
  id: string;
};

export type TenantMemberFindByCriteriaInput = FindByCriteriaInput;
export type PaginatedTenantMemberResult = PaginatedResult<TenantMemberResponse>;
