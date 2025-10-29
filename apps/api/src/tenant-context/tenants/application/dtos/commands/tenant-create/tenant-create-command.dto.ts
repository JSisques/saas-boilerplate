/**
 * Data Transfer Object for creating a new tenant via command layer.
 *
 * @interface ITenantCreateCommandDto
 * @property {string} name - The name of the tenant. Must be provided.
 * @property {string} slug - The slug of the tenant. Must be provided.
 * @property {string | null} description - The description of the tenant. Can be null if not provided.
 * @property {string | null} websiteUrl - The website URL of the tenant. Can be null if not provided.
 * @property {string | null} logoUrl - The logo URL of the tenant. Can be null if not provided.
 * @property {string | null} faviconUrl - The favicon URL of the tenant. Can be null if not provided.
 * @property {string | null} primaryColor - The primary color of the tenant. Can be null if not provided.
 * @property {string | null} secondaryColor - The secondary color of the tenant. Can be null if not provided.
 * @property {string | null} email - The email of the tenant. Can be null if not provided.
 * @property {string | null} phoneNumber - The phone number of the tenant. Can be null if not provided.
 * @property {string | null} phoneCode - The phone code of the tenant. Can be null if not provided.
 * @property {string | null} address - The address of the tenant. Can be null if not provided.
 * @property {string | null} city - The city of the tenant. Can be null if not provided.
 * @property {string | null} state - The state of the tenant. Can be null if not provided.
 * @property {string | null} country - The country of the tenant. Can be null if not provided.
 * @property {string | null} postalCode - The postal code of the tenant. Can be null if not provided.
 * @property {string | null} timezone - The timezone of the tenant. Can be null if not provided.
 * @property {string | null} locale - The locale of the tenant. Can be null if not provided.
 * @property {number | null} maxUsers - The max users of the tenant. Can be null if not provided.
 * @property {number | null} maxStorage - The max storage of the tenant. Can be null if not provided.
 * @property {number | null} maxApiCalls - The max API calls of the tenant. Can be null if not provided.
 */
export interface ITenantCreateCommandDto {
  name: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
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
}
