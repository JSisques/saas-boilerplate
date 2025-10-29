import { ITenantCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-create/tenant-create-view-model.dto';
import { ITenantUpdateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-update/tenant-update-view-model.dto';

/**
 * This class is used to represent a tenant view model.
 */
export class TenantViewModel {
  private readonly _id: string;
  private _name: string;
  private _slug: string;
  private _description: string | null;
  private _websiteUrl: string | null;
  private _logoUrl: string | null;
  private _faviconUrl: string | null;
  private _primaryColor: string | null;
  private _secondaryColor: string | null;
  private _status: string;
  private _email: string | null;
  private _phoneNumber: string | null;
  private _phoneCode: string | null;
  private _address: string | null;
  private _city: string | null;
  private _state: string | null;
  private _country: string | null;
  private _postalCode: string | null;
  private _timezone: string | null;
  private _locale: string | null;
  private _maxUsers: number | null;
  private _maxStorage: number | null;
  private _maxApiCalls: number | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ITenantCreateViewModelDto) {
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
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Updates the tenant view model with new data
   *
   * @param updateData - The data to update
   * @returns A new TenantViewModel instance with updated data
   */
  public update(updateData: ITenantUpdateViewModelDto) {
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._slug = updateData.slug !== undefined ? updateData.slug : this._slug;
    this._description =
      updateData.description !== undefined
        ? updateData.description
        : this._description;
    this._websiteUrl =
      updateData.websiteUrl !== undefined
        ? updateData.websiteUrl
        : this._websiteUrl;
    this._logoUrl =
      updateData.logoUrl !== undefined ? updateData.logoUrl : this._logoUrl;
    this._faviconUrl =
      updateData.faviconUrl !== undefined
        ? updateData.faviconUrl
        : this._faviconUrl;
    this._primaryColor =
      updateData.primaryColor !== undefined
        ? updateData.primaryColor
        : this._primaryColor;
    this._secondaryColor =
      updateData.secondaryColor !== undefined
        ? updateData.secondaryColor
        : this._secondaryColor;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._email =
      updateData.email !== undefined ? updateData.email : this._email;
    this._phoneNumber =
      updateData.phoneNumber !== undefined
        ? updateData.phoneNumber
        : this._phoneNumber;
    this._phoneCode =
      updateData.phoneCode !== undefined
        ? updateData.phoneCode
        : this._phoneCode;
    this._address =
      updateData.address !== undefined ? updateData.address : this._address;
    this._city = updateData.city !== undefined ? updateData.city : this._city;
    this._state =
      updateData.state !== undefined ? updateData.state : this._state;
    this._country =
      updateData.country !== undefined ? updateData.country : this._country;
    this._postalCode =
      updateData.postalCode !== undefined
        ? updateData.postalCode
        : this._postalCode;
    this._timezone =
      updateData.timezone !== undefined ? updateData.timezone : this._timezone;
    this._locale =
      updateData.locale !== undefined ? updateData.locale : this._locale;
    this._maxUsers =
      updateData.maxUsers !== undefined ? updateData.maxUsers : this._maxUsers;
    this._maxStorage =
      updateData.maxStorage !== undefined
        ? updateData.maxStorage
        : this._maxStorage;
    this._maxApiCalls =
      updateData.maxApiCalls !== undefined
        ? updateData.maxApiCalls
        : this._maxApiCalls;
    this._updatedAt = new Date();
  }
  /**
   * Gets the unique identifier of the tenant.
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the name of the tenant.
   * @returns {string}
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the slug of the tenant.
   * @returns {string}
   */
  get slug(): string {
    return this._slug;
  }

  /**
   * Gets the description of the tenant.
   * @returns {string | null}
   */
  get description(): string | null {
    return this._description;
  }

  /**
   * Gets the website URL of the tenant.
   * @returns {string | null}
   */
  get websiteUrl(): string | null {
    return this._websiteUrl;
  }

  /**
   * Gets the logo URL of the tenant.
   * @returns {string | null}
   */
  get logoUrl(): string | null {
    return this._logoUrl;
  }

  /**
   * Gets the favicon URL of the tenant.
   * @returns {string | null}
   */
  get faviconUrl(): string | null {
    return this._faviconUrl;
  }

  /**
   * Gets the primary color of the tenant.
   * @returns {string | null}
   */
  get primaryColor(): string | null {
    return this._primaryColor;
  }

  /**
   * Gets the secondary color of the tenant.
   * @returns {string | null}
   */
  get secondaryColor(): string | null {
    return this._secondaryColor;
  }

  /**
   * Gets the status of the tenant.
   * @returns {string}
   */
  get status(): string {
    return this._status;
  }

  /**
   * Gets the email of the tenant.
   * @returns {string | null}
   */
  get email(): string | null {
    return this._email;
  }

  /**
   * Gets the phone number of the tenant.
   * @returns {string | null}
   */
  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  /**
   * Gets the phone code of the tenant.
   * @returns {string | null}
   */
  get phoneCode(): string | null {
    return this._phoneCode;
  }

  /**
   * Gets the address of the tenant.
   * @returns {string | null}
   */
  get address(): string | null {
    return this._address;
  }

  /**
   * Gets the city of the tenant.
   * @returns {string | null}
   */
  get city(): string | null {
    return this._city;
  }

  /**
   * Gets the state of the tenant.
   * @returns {string | null}
   */
  get state(): string | null {
    return this._state;
  }

  /**
   * Gets the country of the tenant.
   * @returns {string | null}
   */
  get country(): string | null {
    return this._country;
  }

  /**
   * Gets the postal code of the tenant.
   * @returns {string | null}
   */
  get postalCode(): string | null {
    return this._postalCode;
  }

  /**
   * Gets the timezone of the tenant.
   * @returns {string | null}
   */
  get timezone(): string | null {
    return this._timezone;
  }

  /**
   * Gets the locale of the tenant.
   * @returns {string | null}
   */
  get locale(): string | null {
    return this._locale;
  }

  /**
   * Gets the maximum number of users for the tenant.
   * @returns {number | null}
   */
  get maxUsers(): number | null {
    return this._maxUsers;
  }

  /**
   * Gets the maximum storage for the tenant.
   * @returns {number | null}
   */
  get maxStorage(): number | null {
    return this._maxStorage;
  }

  /**
   * Gets the maximum API calls for the tenant.
   * @returns {number | null}
   */
  get maxApiCalls(): number | null {
    return this._maxApiCalls;
  }

  /**
   * Gets the creation timestamp of the tenant.
   * @returns {Date}
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Gets the last updated timestamp of the tenant.
   * @returns {Date}
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
