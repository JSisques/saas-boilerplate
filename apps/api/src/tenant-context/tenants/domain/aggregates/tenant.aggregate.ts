import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantCreateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-create/tenant-create.dto';
import { ITenantUpdateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-update/tenant-update.dto';
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
import { AggregateRoot } from '@nestjs/cqrs';

export class TenantAggregate extends AggregateRoot {
  private readonly _id: TenantUuidValueObject;
  private _name: TenantNameValueObject;
  private _slug: TenantSlugValueObject;
  private _description: TenantDescriptionValueObject | null;
  private _websiteUrl: TenantWebsiteUrlValueObject | null;
  private _logoUrl: TenantLogoUrlValueObject | null;
  private _faviconUrl: TenantFaviconUrlValueObject | null;
  private _primaryColor: TenantPrimaryColorValueObject | null;
  private _secondaryColor: TenantSecondaryColorValueObject | null;
  private _status: TenantStatusValueObject;
  private _email: TenantEmailValueObject | null;
  private _phoneNumber: TenantPhoneNumberValueObject | null;
  private _phoneCode: TenantPhoneCodeValueObject | null;
  private _address: TenantAddressValueObject | null;
  private _city: TenantCityValueObject | null;
  private _state: TenantStateValueObject | null;
  private _country: TenantCountryValueObject | null;
  private _postalCode: TenantPostalCodeValueObject | null;
  private _timezone: TenantTimezoneValueObject | null;
  private _locale: TenantLocaleValueObject | null;
  private _maxUsers: TenantMaxUsersValueObject | null;
  private _maxStorage: TenantMaxStorageValueObject | null;
  private _maxApiCalls: TenantMaxApiCallsValueObject | null;

  constructor(props: ITenantCreateDto, generateEvent: boolean = true) {
    super();

    // 01: Set the properties
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._description = props.description;
    this._websiteUrl = props.websiteUrl;
    this._logoUrl = props.logoUrl;
    this._faviconUrl = props.faviconUrl;
    this._primaryColor = props.primaryColor;
    this._secondaryColor = props.secondaryColor;
    this._status = props.status;
    this._email = props.email;
    this._phoneNumber = props.phoneNumber;
    this._phoneCode = props.phoneCode;
    this._address = props.address;
    this._city = props.city;
    this._state = props.state;
    this._country = props.country;
    this._postalCode = props.postalCode;
    this._timezone = props.timezone;
    this._locale = props.locale;
    this._maxUsers = props.maxUsers;
    this._maxStorage = props.maxStorage;
    this._maxApiCalls = props.maxApiCalls;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new TenantCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantAggregate.name,
            eventType: TenantCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the tenant.
   *
   * @param props - The properties to update the tenant.
   * @param props.name - The name of the tenant.
   * @param props.description - The description of the tenant.
   * @param props.websiteUrl - The website URL of the tenant.
   * @param props.logoUrl - The logo URL of the tenant.
   * @param props.faviconUrl - The favicon URL of the tenant.
   * @param props.primaryColor - The primary color of the tenant.
   * @param props.secondaryColor - The secondary color of the tenant.
   * @param props.status - The status of the tenant.
   * @param props.email - The email of the tenant.
   * @param props.phoneNumber - The phone number of the tenant.
   * @param props.phoneCode - The phone code of the tenant.
   * @param props.address - The address of the tenant.
   * @param props.city - The city of the tenant.
   * @param props.state - The state of the tenant.
   * @param props.country - The country of the tenant.
   * @param props.postalCode - The postal code of the tenant.
   * @param props.timezone - The timezone of the tenant.
   * @param props.locale - The locale of the tenant.
   * @param props.maxUsers - The max users of the tenant.
   * @param props.maxStorage - The max storage of the tenant.
   * @param props.maxApiCalls - The max API calls of the tenant.
   */
  public update(props: ITenantUpdateDto, generateEvent: boolean = true) {
    // 01: Update the properties
    this._name = props.name !== undefined ? props.name : this._name;
    this._slug = props.slug !== undefined ? props.slug : this._slug;
    this._description =
      props.description !== undefined ? props.description : this._description;
    this._websiteUrl =
      props.websiteUrl !== undefined ? props.websiteUrl : this._websiteUrl;
    this._logoUrl = props.logoUrl !== undefined ? props.logoUrl : this._logoUrl;
    this._faviconUrl =
      props.faviconUrl !== undefined ? props.faviconUrl : this._faviconUrl;
    this._primaryColor =
      props.primaryColor !== undefined
        ? props.primaryColor
        : this._primaryColor;
    this._secondaryColor =
      props.secondaryColor !== undefined
        ? props.secondaryColor
        : this._secondaryColor;
    this._status = props.status !== undefined ? props.status : this._status;
    this._email = props.email !== undefined ? props.email : this._email;
    this._phoneNumber =
      props.phoneNumber !== undefined ? props.phoneNumber : this._phoneNumber;
    this._phoneCode =
      props.phoneCode !== undefined ? props.phoneCode : this._phoneCode;
    this._address = props.address !== undefined ? props.address : this._address;
    this._city = props.city !== undefined ? props.city : this._city;
    this._state = props.state !== undefined ? props.state : this._state;
    this._country = props.country !== undefined ? props.country : this._country;
    this._postalCode =
      props.postalCode !== undefined ? props.postalCode : this._postalCode;
    this._timezone =
      props.timezone !== undefined ? props.timezone : this._timezone;
    this._locale = props.locale !== undefined ? props.locale : this._locale;
    this._maxUsers =
      props.maxUsers !== undefined ? props.maxUsers : this._maxUsers;
    this._maxStorage =
      props.maxStorage !== undefined ? props.maxStorage : this._maxStorage;
    this._maxApiCalls =
      props.maxApiCalls !== undefined ? props.maxApiCalls : this._maxApiCalls;

    if (generateEvent) {
      this.apply(
        new TenantUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantAggregate.name,
            eventType: TenantUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the tenant.
   *
   * @param generateEvent - Whether to generate the tenant deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new TenantDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantAggregate.name,
            eventType: TenantDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Get the id of the tenant.
   *
   * @returns The id of the tenant.
   */
  public get id(): TenantUuidValueObject {
    return this._id;
  }

  /**
   * Get the name of the tenant.
   *
   * @returns The name of the tenant.
   */
  public get name(): TenantNameValueObject {
    return this._name;
  }

  /**
   * Get the slug of the tenant.
   *
   * @returns The slug of the tenant.
   */
  public get slug(): TenantSlugValueObject {
    return this._slug;
  }

  /**
   * Get the description of the tenant.
   *
   * @returns The description of the tenant.
   */
  public get description(): TenantDescriptionValueObject | null {
    return this._description;
  }

  /**
   * Get the website URL of the tenant.
   *
   * @returns The website URL of the tenant.
   */
  public get websiteUrl(): TenantWebsiteUrlValueObject | null {
    return this._websiteUrl;
  }

  /**
   * Get the logo URL of the tenant.
   *
   * @returns The logo URL of the tenant.
   */
  public get logoUrl(): TenantLogoUrlValueObject | null {
    return this._logoUrl;
  }

  /**
   * Get the favicon URL of the tenant.
   *
   * @returns The favicon URL of the tenant.
   */
  public get faviconUrl(): TenantFaviconUrlValueObject | null {
    return this._faviconUrl;
  }

  /**
   * Get the primary color of the tenant.
   *
   * @returns The primary color of the tenant.
   */
  public get primaryColor(): TenantPrimaryColorValueObject | null {
    return this._primaryColor;
  }

  /**
   * Get the secondary color of the tenant.
   *
   * @returns The secondary color of the tenant.
   */
  public get secondaryColor(): TenantSecondaryColorValueObject | null {
    return this._secondaryColor;
  }

  /**
   * Get the status of the tenant.
   *
   * @returns The status of the tenant.
   */
  public get status(): TenantStatusValueObject {
    return this._status;
  }

  /**
   * Get the email of the tenant.
   *
   * @returns The email of the tenant.
   */
  public get email(): TenantEmailValueObject | null {
    return this._email;
  }

  /**
   * Get the phone number of the tenant.
   *
   * @returns The phone number of the tenant.
   */
  public get phoneNumber(): TenantPhoneNumberValueObject | null {
    return this._phoneNumber;
  }

  /**
   * Get the phone code of the tenant.
   *
   * @returns The phone code of the tenant.
   */
  public get phoneCode(): TenantPhoneCodeValueObject | null {
    return this._phoneCode;
  }

  /**
   * Get the max users of the tenant.
   *
   * @returns The max users of the tenant.
   */
  public get maxUsers(): TenantMaxUsersValueObject | null {
    return this._maxUsers;
  }

  /**
   * Get the max storage of the tenant.
   *
   * @returns The max storage of the tenant.
   */
  public get maxStorage(): TenantMaxStorageValueObject | null {
    return this._maxStorage;
  }

  /**
   * Get the max API calls of the tenant.
   *
   * @returns The max API calls of the tenant.
   */
  public get maxApiCalls(): TenantMaxApiCallsValueObject | null {
    return this._maxApiCalls;
  }

  /**
   * Get the address of the tenant.
   *
   * @returns The address of the tenant.
   */
  public get address(): TenantAddressValueObject | null {
    return this._address;
  }

  /**
   * Get the city of the tenant.
   *
   * @returns The city of the tenant.
   */
  public get city(): TenantCityValueObject | null {
    return this._city;
  }
  /**
   * Get the state of the tenant.
   *
   * @returns The state of the tenant.
   */
  public get state(): TenantStateValueObject | null {
    return this._state;
  }
  /**
   * Get the country of the tenant.
   *
   * @returns The country of the tenant.
   */
  public get country(): TenantCountryValueObject | null {
    return this._country;
  }
  /**
   * Get the postal code of the tenant.
   *
   * @returns The postal code of the tenant.
   */
  public get postalCode(): TenantPostalCodeValueObject | null {
    return this._postalCode;
  }
  /**
   * Get the timezone of the tenant.
   *
   * @returns The timezone of the tenant.
   */
  public get timezone(): TenantTimezoneValueObject | null {
    return this._timezone;
  }
  /**
   * Get the locale of the tenant.
   *
   * @returns The locale of the tenant.
   */
  public get locale(): TenantLocaleValueObject | null {
    return this._locale;
  }
  /**
   * Convert the tenant aggregate to primitives.
   *
   * @returns The primitives of the tenant.
   */
  public toPrimitives(): TenantPrimitives {
    return {
      id: this._id.value,
      name: this._name.value,
      slug: this._slug.value,
      description: this._description ? this._description.value : null,
      websiteUrl: this._websiteUrl ? this._websiteUrl.value : null,
      logoUrl: this._logoUrl ? this._logoUrl.value : null,
      faviconUrl: this._faviconUrl ? this._faviconUrl.value : null,
      primaryColor: this._primaryColor ? this._primaryColor.value : null,
      secondaryColor: this._secondaryColor ? this._secondaryColor.value : null,
      status: this._status.value,
      email: this._email ? this._email.value : null,
      phoneNumber: this._phoneNumber ? this._phoneNumber.value : null,
      phoneCode: this._phoneCode ? this._phoneCode.value : null,
      address: this._address ? this._address.value : null,
      city: this._city ? this._city.value : null,
      state: this._state ? this._state.value : null,
      country: this._country ? this._country.value : null,
      postalCode: this._postalCode ? this._postalCode.value : null,
      timezone: this._timezone ? this._timezone.value : null,
      locale: this._locale ? this._locale.value : null,
      maxUsers: this._maxUsers ? this._maxUsers.value : null,
      maxStorage: this._maxStorage ? this._maxStorage.value : null,
      maxApiCalls: this._maxApiCalls ? this._maxApiCalls.value : null,
    };
  }
}
