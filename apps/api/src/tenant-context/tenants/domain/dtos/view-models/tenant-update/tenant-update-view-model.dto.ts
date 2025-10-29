import { ITenantCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-create/tenant-create-view-model.dto';

/**
 * Data Transfer Object for updating a tenant view model.
 *
 * @interface ITenantUpdateViewModelDto
 * @property {string | null} name - The name of the tenant (nullable).
 * @property {string | null} slug - The slug of the tenant (nullable).
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
 * @property {Date} createdAt - Timestamp when the tenant was created.
 * @property {Date} updatedAt - Timestamp when the tenant was last updated.
 */
export interface ITenantUpdateViewModelDto
  extends Partial<
    Omit<ITenantCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
  > {}
