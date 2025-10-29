import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string.exception';
import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * Phone Code Value Object
 * This value object is responsible for encapsulating phone country codes with validation.
 * It ensures that the phone code meets international standards and format requirements.
 * @param value - The phone code value (e.g., "+34", "+1", "+44").
 * @param options - Validation options for the phone code.
 * @returns A new instance of the PhoneCodeValueObject.
 */
export class PhoneCodeValueObject extends StringValueObject {
  private static readonly PHONE_CODE_PATTERN = /^\+[1-9]\d{0,3}$/;
  private static readonly MIN_LENGTH = 2; // Minimum: +1
  private static readonly MAX_LENGTH = 5; // Maximum: +1234

  // Common phone codes for validation
  private static readonly COMMON_PHONE_CODES = new Set([
    '+1',
    '+7',
    '+20',
    '+27',
    '+30',
    '+31',
    '+32',
    '+33',
    '+34',
    '+36',
    '+39',
    '+40',
    '+41',
    '+43',
    '+44',
    '+45',
    '+46',
    '+47',
    '+48',
    '+49',
    '+51',
    '+52',
    '+53',
    '+54',
    '+55',
    '+56',
    '+57',
    '+58',
    '+60',
    '+61',
    '+62',
    '+63',
    '+64',
    '+65',
    '+66',
    '+81',
    '+82',
    '+84',
    '+86',
    '+90',
    '+91',
    '+92',
    '+93',
    '+94',
    '+95',
    '+98',
    '+212',
    '+213',
    '+216',
    '+218',
    '+220',
    '+221',
    '+222',
    '+223',
    '+224',
    '+225',
    '+226',
    '+227',
    '+228',
    '+229',
    '+230',
    '+231',
    '+232',
    '+233',
    '+234',
    '+235',
    '+236',
    '+237',
    '+238',
    '+239',
    '+240',
    '+241',
    '+242',
    '+243',
    '+244',
    '+245',
    '+246',
    '+247',
    '+248',
    '+249',
    '+250',
    '+251',
    '+252',
    '+253',
    '+254',
    '+255',
    '+256',
    '+257',
    '+258',
    '+260',
    '+261',
    '+262',
    '+263',
    '+264',
    '+265',
    '+266',
    '+267',
    '+268',
    '+269',
    '+290',
    '+291',
    '+297',
    '+298',
    '+299',
    '+350',
    '+351',
    '+352',
    '+353',
    '+354',
    '+355',
    '+356',
    '+357',
    '+358',
    '+359',
    '+370',
    '+371',
    '+372',
    '+373',
    '+374',
    '+375',
    '+376',
    '+377',
    '+378',
    '+380',
    '+381',
    '+382',
    '+383',
    '+385',
    '+386',
    '+387',
    '+389',
    '+420',
    '+421',
    '+423',
    '+500',
    '+501',
    '+502',
    '+503',
    '+504',
    '+505',
    '+506',
    '+507',
    '+508',
    '+509',
    '+590',
    '+591',
    '+592',
    '+593',
    '+594',
    '+595',
    '+596',
    '+597',
    '+598',
    '+599',
    '+670',
    '+672',
    '+673',
    '+674',
    '+675',
    '+676',
    '+677',
    '+678',
    '+679',
    '+680',
    '+681',
    '+682',
    '+683',
    '+684',
    '+685',
    '+686',
    '+687',
    '+688',
    '+689',
    '+690',
    '+691',
    '+692',
    '+850',
    '+852',
    '+853',
    '+855',
    '+856',
    '+880',
    '+886',
    '+960',
    '+961',
    '+962',
    '+963',
    '+964',
    '+965',
    '+966',
    '+967',
    '+968',
    '+970',
    '+971',
    '+972',
    '+973',
    '+974',
    '+975',
    '+976',
    '+977',
    '+992',
    '+993',
    '+994',
    '+995',
    '+996',
    '+998',
  ]);

  constructor(
    value: string,
    options: {
      allowEmpty?: boolean;
      validateExistence?: boolean;
    } = {},
  ) {
    const processedValue = PhoneCodeValueObject.normalizePhoneCode(value);

    super(processedValue, {
      minLength: PhoneCodeValueObject.MIN_LENGTH,
      maxLength: PhoneCodeValueObject.MAX_LENGTH,
      allowEmpty: options.allowEmpty ?? false,
      pattern: PhoneCodeValueObject.PHONE_CODE_PATTERN,
      trim: true,
    });

    if (options.validateExistence !== false) {
      this.validateExistence();
    }
  }

  /**
   * Creates a new PhoneCodeValueObject from a string
   * @param code - The phone code string
   * @param options - Validation options
   * @returns A new PhoneCodeValueObject
   */
  public static fromString(
    code: string,
    options: {
      allowEmpty?: boolean;
      validateExistence?: boolean;
    } = {},
  ): PhoneCodeValueObject {
    return new PhoneCodeValueObject(code, options);
  }

  /**
   * Normalizes a phone code string
   * @param code - The phone code to normalize
   * @returns A normalized phone code string
   */
  public static normalizePhoneCode(code: string): string {
    if (!code || typeof code !== 'string') {
      return '';
    }

    let normalized = code.trim();

    // Add + if missing
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    // Remove any non-digit characters except +
    normalized = normalized.replace(/[^\d+]/g, '');

    return normalized;
  }

  /**
   * Checks if the phone code exists in the common codes list
   * @returns True if the code exists
   */
  public exists(): boolean {
    return PhoneCodeValueObject.COMMON_PHONE_CODES.has(this.value);
  }

  /**
   * Gets the country code without the + sign
   * @returns The numeric country code
   */
  public getNumericCode(): string {
    return this.value.substring(1);
  }

  /**
   * Gets the country code with the + sign
   * @returns The full country code with +
   */
  public getFullCode(): string {
    return this.value;
  }

  /**
   * Checks if the phone code is a valid format
   * @returns True if valid format
   */
  public isValidFormat(): boolean {
    return PhoneCodeValueObject.PHONE_CODE_PATTERN.test(this.value);
  }

  /**
   * Checks if the phone code is a North American number (US/Canada)
   * @returns True if North American
   */
  public isNorthAmerican(): boolean {
    return this.value === '+1';
  }

  /**
   * Checks if the phone code is European
   * @returns True if European
   */
  public isEuropean(): boolean {
    const europeanCodes = [
      '+30',
      '+31',
      '+32',
      '+33',
      '+34',
      '+36',
      '+39',
      '+40',
      '+41',
      '+43',
      '+44',
      '+45',
      '+46',
      '+47',
      '+48',
      '+49',
    ];
    return europeanCodes.includes(this.value);
  }

  /**
   * Gets the region name for the phone code (if known)
   * @returns The region name or null if unknown
   */
  public getRegionName(): string | null {
    const regionMap: Record<string, string> = {
      '+1': 'North America (US/Canada)',
      '+7': 'Russia/Kazakhstan',
      '+20': 'Egypt',
      '+27': 'South Africa',
      '+30': 'Greece',
      '+31': 'Netherlands',
      '+32': 'Belgium',
      '+33': 'France',
      '+34': 'Spain',
      '+36': 'Hungary',
      '+39': 'Italy',
      '+40': 'Romania',
      '+41': 'Switzerland',
      '+43': 'Austria',
      '+44': 'United Kingdom',
      '+45': 'Denmark',
      '+46': 'Sweden',
      '+47': 'Norway',
      '+48': 'Poland',
      '+49': 'Germany',
      '+51': 'Peru',
      '+52': 'Mexico',
      '+53': 'Cuba',
      '+54': 'Argentina',
      '+55': 'Brazil',
      '+56': 'Chile',
      '+57': 'Colombia',
      '+58': 'Venezuela',
      '+60': 'Malaysia',
      '+61': 'Australia',
      '+62': 'Indonesia',
      '+63': 'Philippines',
      '+64': 'New Zealand',
      '+65': 'Singapore',
      '+66': 'Thailand',
      '+81': 'Japan',
      '+82': 'South Korea',
      '+84': 'Vietnam',
      '+86': 'China',
      '+90': 'Turkey',
      '+91': 'India',
      '+92': 'Pakistan',
      '+93': 'Afghanistan',
      '+94': 'Sri Lanka',
      '+95': 'Myanmar',
      '+98': 'Iran',
    };

    return regionMap[this.value] || null;
  }

  /**
   * Validates that the phone code exists in the common codes list
   * @throws InvalidStringException if code doesn't exist
   */
  private validateExistence(): void {
    if (!this.exists()) {
      throw new InvalidStringException(
        `Phone code ${this.value} is not recognized as a valid country code`,
      );
    }
  }

  /**
   * Override equals to compare phone codes case-insensitively
   * @param other - The other PhoneCodeValueObject to compare
   * @returns True if equal
   */
  public equals(other: PhoneCodeValueObject): boolean {
    return this.value === other.value;
  }
}
