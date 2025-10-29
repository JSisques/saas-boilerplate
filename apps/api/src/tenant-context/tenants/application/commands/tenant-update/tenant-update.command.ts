import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantUpdateCommandDto } from '@/tenant-context/tenants/application/dtos/commands/tenant-update/tenant-update-command.dto';
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

export class TenantUpdateCommand {
  readonly id: TenantUuidValueObject;
  readonly name?: TenantNameValueObject;
  readonly slug?: TenantSlugValueObject;
  readonly description?: TenantDescriptionValueObject | null;
  readonly websiteUrl?: TenantWebsiteUrlValueObject | null;
  readonly logoUrl?: TenantLogoUrlValueObject | null;
  readonly faviconUrl?: TenantFaviconUrlValueObject | null;
  readonly primaryColor?: TenantPrimaryColorValueObject | null;
  readonly secondaryColor?: TenantSecondaryColorValueObject | null;
  readonly status?: TenantStatusValueObject;
  readonly email?: TenantEmailValueObject | null;
  readonly phoneNumber?: TenantPhoneNumberValueObject | null;
  readonly phoneCode?: TenantPhoneCodeValueObject | null;
  readonly address?: TenantAddressValueObject | null;
  readonly city?: TenantCityValueObject | null;
  readonly state?: TenantStateValueObject | null;
  readonly country?: TenantCountryValueObject | null;
  readonly postalCode?: TenantPostalCodeValueObject | null;
  readonly timezone?: TenantTimezoneValueObject | null;
  readonly locale?: TenantLocaleValueObject | null;
  readonly maxUsers?: TenantMaxUsersValueObject | null;
  readonly maxStorage?: TenantMaxStorageValueObject | null;
  readonly maxApiCalls?: TenantMaxApiCallsValueObject | null;

  constructor(props: ITenantUpdateCommandDto) {
    this.id = new TenantUuidValueObject(props.id);

    if (props.name !== undefined) {
      this.name = props.name ? new TenantNameValueObject(props.name) : null;
      this.slug = new TenantSlugValueObject(props.name, {
        generateFromString: true,
      });
    }

    if (props.description !== undefined) {
      this.description = props.description
        ? new TenantDescriptionValueObject(props.description)
        : null;
    }

    if (props.websiteUrl !== undefined) {
      this.websiteUrl = props.websiteUrl
        ? new TenantWebsiteUrlValueObject(props.websiteUrl)
        : null;
    }

    if (props.logoUrl !== undefined) {
      this.logoUrl = props.logoUrl
        ? new TenantLogoUrlValueObject(props.logoUrl)
        : null;
    }

    if (props.faviconUrl !== undefined) {
      this.faviconUrl = props.faviconUrl
        ? new TenantFaviconUrlValueObject(props.faviconUrl)
        : null;
    }

    if (props.primaryColor !== undefined) {
      this.primaryColor = props.primaryColor
        ? new TenantPrimaryColorValueObject(props.primaryColor)
        : null;
    }

    if (props.secondaryColor !== undefined) {
      this.secondaryColor = props.secondaryColor
        ? new TenantSecondaryColorValueObject(props.secondaryColor)
        : null;
    }

    if (props.status !== undefined) {
      this.status = props.status
        ? new TenantStatusValueObject(props.status)
        : null;
    }

    if (props.email !== undefined) {
      this.email = props.email ? new TenantEmailValueObject(props.email) : null;
    }

    if (props.phoneNumber !== undefined) {
      this.phoneNumber = props.phoneNumber
        ? new TenantPhoneNumberValueObject(props.phoneNumber)
        : null;
    }

    if (props.phoneCode !== undefined) {
      this.phoneCode = props.phoneCode
        ? new TenantPhoneCodeValueObject(props.phoneCode)
        : null;
    }

    if (props.address !== undefined) {
      this.address = props.address
        ? new TenantAddressValueObject(props.address)
        : null;
    }

    if (props.city !== undefined) {
      this.city = props.city ? new TenantCityValueObject(props.city) : null;
    }

    if (props.state !== undefined) {
      this.state = props.state ? new TenantStateValueObject(props.state) : null;
    }

    if (props.country !== undefined) {
      this.country = props.country
        ? new TenantCountryValueObject(props.country)
        : null;
    }

    if (props.postalCode !== undefined) {
      this.postalCode = props.postalCode
        ? new TenantPostalCodeValueObject(props.postalCode)
        : null;
    }

    if (props.timezone !== undefined) {
      this.timezone = props.timezone
        ? new TenantTimezoneValueObject(props.timezone)
        : null;
    }

    if (props.locale !== undefined) {
      this.locale = props.locale
        ? new TenantLocaleValueObject(props.locale)
        : null;
    }

    if (props.maxUsers !== undefined) {
      this.maxUsers = props.maxUsers
        ? new TenantMaxUsersValueObject(props.maxUsers)
        : null;
    }

    if (props.maxStorage !== undefined) {
      this.maxStorage = props.maxStorage
        ? new TenantMaxStorageValueObject(props.maxStorage)
        : null;
    }

    if (props.maxApiCalls !== undefined) {
      this.maxApiCalls = props.maxApiCalls
        ? new TenantMaxApiCallsValueObject(props.maxApiCalls)
        : null;
    }
  }
}
