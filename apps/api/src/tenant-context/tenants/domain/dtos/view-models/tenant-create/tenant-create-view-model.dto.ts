import { TenantMemberViewModel } from '@/tenant-context/tenants/domain/view-models/tenant-member/tenant-member.view-model';

/**
 * Tenant creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a tenant is created, tailored for presentation layers.
 *
 * @interface ITenantCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the tenant.
 * @property {string} name - The name of the tenant.
 * @property {string} slug - The slug of the tenant.
 * @property {string | null} description - The description of the tenant (nullable).
 * @property {string | null} websiteUrl - The website URL of the tenant (nullable).
 * @property {string | null} logoUrl - The logo URL of the tenant (nullable).
 * @property {string | null} faviconUrl - The favicon URL of the tenant (nullable).
 * @property {string | null} primaryColor - The primary color of the tenant (nullable).
 * @property {string | null} secondaryColor - The secondary color of the tenant (nullable).
 * @property {string} status - The status of the tenant.
 * @property {string | null} email - The email of the tenant (nullable).
 * @property {string | null} phoneNumber - The phone number of the tenant (nullable).
 * @property {string | null} phoneCode - The phone code of the tenant (nullable).
 * @property {string | null} address - The address of the tenant (nullable).
 * @property {string | null} city - The city of the tenant (nullable).
 * @property {string | null} state - The state of the tenant (nullable).
 * @property {string | null} country - The country of the tenant (nullable).
 * @property {string | null} postalCode - The postal code of the tenant (nullable).
 * @property {string | null} timezone - The timezone of the tenant (nullable).
 * @property {string | null} locale - The locale of the tenant (nullable).
 * @property {number | null} maxUsers - The max users of the tenant (nullable).
 * @property {number | null} maxStorage - The max storage of the tenant (nullable).
 * @property {number | null} maxApiCalls - The max API calls of the tenant (nullable).
 * @property {TenantMemberViewModel[]} tenantMembers - The tenant members of the tenant.
 * @property {Date} createdAt - Timestamp when the tenant was created.
 * @property {Date} updatedAt - Timestamp when the tenant was last updated.
 */
export interface ITenantCreateViewModelDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  status: string;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  timezone: string | null;
  locale: string | null;
  maxUsers: number | null;
  maxStorage: number | null;
  maxApiCalls: number | null;

  tenantMembers: TenantMemberViewModel[];

  createdAt?: Date;
  updatedAt?: Date;
}
