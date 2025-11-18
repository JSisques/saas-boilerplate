import { InvalidTimezoneException } from '@/shared/domain/exceptions/value-objects/invalid-timezone/invalid-timezone.exception';
import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * Timezone Value Object
 * This value object is responsible for encapsulating timezone values with validation.
 * It ensures that the timezone is a valid IANA timezone identifier.
 * @param value - The timezone value (e.g., "Europe/Madrid", "America/New_York").
 * @param options - Validation options for the timezone.
 * @returns A new instance of the TimezoneValueObject.
 */
export class TimezoneValueObject extends StringValueObject {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 50;

  // Common timezone identifiers for validation
  private static readonly COMMON_TIMEZONES = new Set([
    'UTC',
    'Europe/London',
    'Europe/Paris',
    'Europe/Madrid',
    'Europe/Berlin',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Zurich',
    'Europe/Stockholm',
    'Europe/Oslo',
    'Europe/Copenhagen',
    'Europe/Helsinki',
    'Europe/Warsaw',
    'Europe/Prague',
    'Europe/Budapest',
    'Europe/Bucharest',
    'Europe/Sofia',
    'Europe/Athens',
    'Europe/Istanbul',
    'Europe/Moscow',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Lima',
    'America/Bogota',
    'America/Caracas',
    'America/Santiago',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Asia/Manila',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Tehran',
    'Asia/Riyadh',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Perth',
    'Pacific/Auckland',
    'Pacific/Honolulu',
  ]);

  constructor(
    value: string,
    options: {
      allowEmpty?: boolean;
      validateExistence?: boolean;
    } = {},
  ) {
    const processedValue = TimezoneValueObject.normalizeTimezone(value);

    super(processedValue, {
      minLength: TimezoneValueObject.MIN_LENGTH,
      maxLength: TimezoneValueObject.MAX_LENGTH,
      allowEmpty: options.allowEmpty ?? false,
      trim: true,
    });

    if (options.validateExistence !== false) {
      this.validateExistence();
    }
  }

  /**
   * Creates a new TimezoneValueObject from a string
   * @param timezone - The timezone string
   * @param options - Validation options
   * @returns A new TimezoneValueObject
   */
  public static fromString(
    timezone: string,
    options: {
      allowEmpty?: boolean;
      validateExistence?: boolean;
    } = {},
  ): TimezoneValueObject {
    return new TimezoneValueObject(timezone, options);
  }

  /**
   * Normalizes a timezone string
   * @param timezone - The timezone to normalize
   * @returns A normalized timezone string
   */
  public static normalizeTimezone(timezone: string): string {
    if (!timezone || typeof timezone !== 'string') {
      return '';
    }

    return timezone.trim();
  }

  /**
   * Checks if the timezone exists in the common timezones list
   * @returns True if the timezone exists
   */
  public exists(): boolean {
    return TimezoneValueObject.COMMON_TIMEZONES.has(this.value);
  }

  /**
   * Checks if the timezone is UTC
   * @returns True if UTC
   */
  public isUTC(): boolean {
    return this.value === 'UTC';
  }

  /**
   * Gets the region from the timezone (e.g., "Europe" from "Europe/Madrid")
   * @returns The region or null if invalid format
   */
  public getRegion(): string | null {
    const parts = this.value.split('/');
    return parts.length >= 2 ? parts[0] : null;
  }

  /**
   * Gets the city from the timezone (e.g., "Madrid" from "Europe/Madrid")
   * @returns The city or null if invalid format
   */
  public getCity(): string | null {
    const parts = this.value.split('/');
    return parts.length >= 2 ? parts[1] : null;
  }

  /**
   * Checks if the timezone is European
   * @returns True if European
   */
  public isEuropean(): boolean {
    return this.getRegion() === 'Europe';
  }

  /**
   * Checks if the timezone is American
   * @returns True if American
   */
  public isAmerican(): boolean {
    return this.getRegion() === 'America';
  }

  /**
   * Checks if the timezone is Asian
   * @returns True if Asian
   */
  public isAsian(): boolean {
    return this.getRegion() === 'Asia';
  }

  /**
   * Validates that the timezone exists in the common timezones list
   * @throws InvalidTimezoneException if timezone doesn't exist
   */
  private validateExistence(): void {
    if (!this.exists()) {
      throw new InvalidTimezoneException(
        `Timezone ${this.value} is not recognized as a valid timezone`,
      );
    }
  }
}
