import { InvalidPhoneException } from '@repo/shared/domain/exceptions/value-objects/invalid-phone.exception';

/**
 * Phone Value Object
 * This value object is responsible for encapsulating phone numbers.
 * It ensures that the phone number is valid and properly formatted.
 * @param value - The phone number.
 * @returns A new instance of the PhoneValueObject.
 */
export class PhoneValueObject {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = this.normalize(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: PhoneValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Gets the country code from the phone number
   * @returns The country code or null if not found
   */
  public getCountryCode(): string | null {
    const match = this._value.match(/^\+(\d{1,4})/);
    return match ? match[1] : null;
  }

  /**
   * Gets the national number (without country code)
   * @returns The national number
   */
  public getNationalNumber(): string {
    const countryCode = this.getCountryCode();
    if (countryCode) {
      return this._value.replace(`+${countryCode}`, '');
    }
    return this._value;
  }

  /**
   * Formats the phone number in E.164 format
   * @returns The phone number in E.164 format
   */
  public toE164(): string {
    return this._value.startsWith('+') ? this._value : `+${this._value}`;
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkIsValidPhone(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidPhoneException('Phone number cannot be empty');
    }
  }

  private checkIsValidPhone(value: string): void {
    // Remove all non-digit characters except +
    const cleanValue = value.replace(/[^\d+]/g, '');

    // Check if it's a valid international format
    const internationalPattern = /^\+[1-9]\d{1,14}$/;
    // Check if it's a valid national format (7-15 digits)
    const nationalPattern = /^\d{7,15}$/;

    if (
      !internationalPattern.test(cleanValue) &&
      !nationalPattern.test(cleanValue)
    ) {
      throw new InvalidPhoneException('Invalid phone number format');
    }

    // Check length constraints
    if (cleanValue.length < 7 || cleanValue.length > 16) {
      throw new InvalidPhoneException(
        'Phone number must be between 7 and 16 digits',
      );
    }
  }

  private normalize(value: string): string {
    // Remove all non-digit characters except +
    let normalized = value.replace(/[^\d+]/g, '');

    // If it doesn't start with +, add it
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    return normalized;
  }
}
