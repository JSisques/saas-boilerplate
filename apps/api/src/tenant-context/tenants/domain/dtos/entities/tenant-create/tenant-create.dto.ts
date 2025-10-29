import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantAddressValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-address/tenant-address.vo';
import { TenantCityValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-city/tenant-city.vo';
import { TenantCountryValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-country/tenant-country.vo';
import { TenantDescriptionValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-description/tenant-description.vo';
import { TenantEmailValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-email/tenant-email.vo';
import { TenantFaviconUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-favicon-url/tenant-favicon-url.vo';
import { TenantLocaleValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-locale/tenant-locale.vo';
import { TenantLogoUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-logo-url/tenant-logo-url.vo';
import { TenantMaxApiCallsValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-api-calls/tenant-max-api-calls.vo';
import { TenantMaxStorageValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-storage/tenant-max-storage.vo';
import { TenantMaxUsersValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-users/tenant-max-users.vo';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantPhoneCodeValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-phone-code/tenant-phone-code.vo';
import { TenantPhoneNumberValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-phone-number/tenant-phone-number.vo';
import { TenantPostalCodeValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-postal-code/tenant-postal-code.vo';
import { TenantPrimaryColorValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-primary-color/tenant-primary-color.vo';
import { TenantSecondaryColorValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-secondary-color/tenant-secondary-color.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStateValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-state/tenant-state.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { TenantTimezoneValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-timezone/tenant-timezone.vo';
import { TenantWebsiteUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-website-url/tenant-website-url.vo';

/**
 * Interface representing the structure required to create a new tenant entity.
 *
 * @interface ITenantCreateDto
 * @property {TenantNameValueObject} name - The name of the tenant.
 * @property {TenantSlugValueObject} slug - The slug of the tenant.
 * @property {TenantDescriptionValueObject} [description] - The description of the tenant. Optional.
 * @property {TenantWebsiteUrlValueObject} [websiteUrl] - The website URL of the tenant. Optional.
 * @property {TenantLogoUrlValueObject} [logoUrl] - The logo URL of the tenant. Optional.
 * @property {TenantFaviconUrlValueObject} [faviconUrl] - The favicon URL of the tenant. Optional.
 * @property {TenantPrimaryColorValueObject} [primaryColor] - The primary color of the tenant. Optional.
 * @property {TenantSecondaryColorValueObject} [secondaryColor] - The secondary color of the tenant. Optional.
 * @property {TenantEmailValueObject} [email] - The email of the tenant. Optional.
 * @property {TenantPhoneNumberValueObject} [phoneNumber] - The phone number of the tenant. Optional.
 * @property {TenantPhoneCodeValueObject} [phoneCode] - The phone code of the tenant. Optional.
 * @property {TenantAddressValueObject} [address] - The address of the tenant. Optional.
 * @property {TenantCityValueObject} [city] - The city of the tenant. Optional.
 * @property {TenantStateValueObject} [state] - The state of the tenant. Optional.
 * @property {TenantCountryValueObject} [country] - The country of the tenant. Optional.
 * @property {TenantPostalCodeValueObject} [postalCode] - The postal code of the tenant. Optional.
 * @property {TenantTimezoneValueObject} [timezone] - The timezone of the tenant. Optional.
 * @property {TenantLocaleValueObject} [locale] - The locale of the tenant. Optional.
 * @property {TenantMaxUsersValueObject} [maxUsers] - The max users of the tenant. Optional.
 * @property {TenantMaxStorageValueObject} [maxStorage] - The max storage of the tenant. Optional.
 * @property {TenantMaxApiCallsValueObject} [maxApiCalls] - The max API calls of the tenant. Optional.
 */
export interface ITenantCreateDto {
  id: TenantUuidValueObject;
  name: TenantNameValueObject;
  slug: TenantSlugValueObject;
  description: TenantDescriptionValueObject | null;
  websiteUrl: TenantWebsiteUrlValueObject | null;
  logoUrl: TenantLogoUrlValueObject | null;
  faviconUrl: TenantFaviconUrlValueObject | null;
  primaryColor: TenantPrimaryColorValueObject | null;
  secondaryColor: TenantSecondaryColorValueObject | null;
  status: TenantStatusValueObject;
  email: TenantEmailValueObject | null;
  phoneNumber: TenantPhoneNumberValueObject | null;
  phoneCode: TenantPhoneCodeValueObject | null;
  address: TenantAddressValueObject | null;
  city: TenantCityValueObject | null;
  state: TenantStateValueObject | null;
  country: TenantCountryValueObject | null;
  postalCode: TenantPostalCodeValueObject | null;
  timezone: TenantTimezoneValueObject | null;
  locale: TenantLocaleValueObject | null;
  maxUsers: TenantMaxUsersValueObject | null;
  maxStorage: TenantMaxStorageValueObject | null;
  maxApiCalls: TenantMaxApiCallsValueObject | null;
}
