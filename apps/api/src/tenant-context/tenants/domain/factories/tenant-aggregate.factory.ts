import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { ITenantCreateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-create/tenant-create.dto';
import { TenantPrimitives } from '@/tenant-context/tenants/domain/primitives/tenant.primitives';
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
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating TenantAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate tenant information.
 */
@Injectable()
export class TenantAggregateFactory
  implements IWriteFactory<TenantAggregate, ITenantCreateDto>
{
  /**
   * Creates a new TenantAggregate entity using the provided properties.
   *
   * @param data - The tenant create data.
   * @param data.id - The tenant id.
   * @param data.name - The tenant name.
   * @param data.slug - The tenant slug.
   * @param data.description - The tenant description.
   * @param data.websiteUrl - The tenant website url.
   * @param data.logoUrl - The tenant logo url.
   * @param data.faviconUrl - The tenant favicon url.
   * @param data.primaryColor - The tenant primary color.
   * @param data.secondaryColor - The tenant secondary color.
   * @param data.status - The tenant status.
   * @param data.email - The tenant email.
   * @param data.phoneNumber - The tenant phone number.
   * @param data.phoneCode - The tenant phone code.
   * @param data.address - The tenant address.
   * @param data.city - The tenant city.
   * @param data.state - The tenant state.
   * @param data.country - The tenant country.
   * @param data.postalCode - The tenant postal code.
   * @param data.timezone - The tenant timezone.
   * @param data.locale - The tenant locale.
   * @param data.maxUsers - The tenant max users.
   * @param data.maxStorage - The tenant max storage.
   * @param data.maxApiCalls - The tenant max API calls.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {TenantAggregate} - The created tenant aggregate entity.
   */
  public create(
    data: ITenantCreateDto,
    generateEvent: boolean = true,
  ): TenantAggregate {
    return new TenantAggregate(data, generateEvent);
  }

  /**
   * Creates a new TenantAggregate entity from primitive data.
   *
   * @param data - The tenant primitive data.
   * @param data.id - The tenant id.
   * @param data.name - The tenant name.
   * @param data.slug - The tenant slug.
   * @param data.description - The tenant description.
   * @param data.websiteUrl - The tenant website url.
   * @param data.logoUrl - The tenant logo url.
   * @param data.faviconUrl - The tenant favicon url.
   * @param data.primaryColor - The tenant primary color.
   * @param data.secondaryColor - The tenant secondary color.
   * @param data.status - The tenant status.
   * @param data.email - The tenant email.
   * @param data.phoneNumber - The tenant phone number.
   * @param data.lastName - The user last name.
   * @param data.phoneCode - The tenant phone code.
   * @param data.address - The tenant address.
   * @param data.city - The tenant city.
   * @param data.state - The tenant state.
   * @param data.country - The tenant country.
   * @param data.postalCode - The tenant postal code.
   * @param data.timezone - The tenant timezone.
   * @param data.locale - The tenant locale.
   * @param data.maxUsers - The tenant max users.
   * @param data.maxStorage - The tenant max storage.
   * @param data.maxApiCalls - The tenant max API calls.
   * @returns The created tenant aggregate entity.
   */
  public fromPrimitives(data: TenantPrimitives): TenantAggregate {
    return new TenantAggregate({
      id: new TenantUuidValueObject(data.id),
      name: new TenantNameValueObject(data.name),
      slug: new TenantSlugValueObject(data.slug),
      description: data.description
        ? new TenantDescriptionValueObject(data.description)
        : null,
      websiteUrl: data.websiteUrl
        ? new TenantWebsiteUrlValueObject(data.websiteUrl)
        : null,
      logoUrl: data.logoUrl ? new TenantLogoUrlValueObject(data.logoUrl) : null,
      faviconUrl: data.faviconUrl
        ? new TenantFaviconUrlValueObject(data.faviconUrl)
        : null,
      primaryColor: data.primaryColor
        ? new TenantPrimaryColorValueObject(data.primaryColor)
        : null,
      secondaryColor: data.secondaryColor
        ? new TenantSecondaryColorValueObject(data.secondaryColor)
        : null,
      status: new TenantStatusValueObject(data.status),
      email: data.email ? new TenantEmailValueObject(data.email) : null,
      phoneNumber: data.phoneNumber
        ? new TenantPhoneNumberValueObject(data.phoneNumber)
        : null,
      phoneCode: data.phoneCode
        ? new TenantPhoneCodeValueObject(data.phoneCode)
        : null,
      address: data.address ? new TenantAddressValueObject(data.address) : null,
      city: data.city ? new TenantCityValueObject(data.city) : null,
      state: data.state ? new TenantStateValueObject(data.state) : null,
      country: data.country ? new TenantCountryValueObject(data.country) : null,
      postalCode: data.postalCode
        ? new TenantPostalCodeValueObject(data.postalCode)
        : null,
      timezone: data.timezone
        ? new TenantTimezoneValueObject(data.timezone)
        : null,
      locale: data.locale ? new TenantLocaleValueObject(data.locale) : null,
      maxUsers: data.maxUsers
        ? new TenantMaxUsersValueObject(data.maxUsers)
        : null,
      maxStorage: data.maxStorage
        ? new TenantMaxStorageValueObject(data.maxStorage)
        : null,
      maxApiCalls: data.maxApiCalls
        ? new TenantMaxApiCallsValueObject(data.maxApiCalls)
        : null,
    });
  }
}
