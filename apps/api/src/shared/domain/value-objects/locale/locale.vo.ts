import { InvalidLocaleException } from '@/shared/domain/exceptions/value-objects/invalid-locale/invalid-locale.exception';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * Locale Value Object
 * This value object is responsible for encapsulating locale values with validation.
 * It ensures that the locale is a valid BCP 47 locale identifier.
 * @param value - The locale value (e.g., "en-US", "es-ES", "fr-FR").
 * @param options - Validation options for the locale.
 * @returns A new instance of the LocaleValueObject.
 */
export class LocaleValueObject extends StringValueObject {
  private static readonly LOCALE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 10;

  // Common locale identifiers for validation
  private static readonly COMMON_LOCALES = new Set([
    'en',
    'en-US',
    'en-GB',
    'en-CA',
    'en-AU',
    'es',
    'es-ES',
    'es-MX',
    'es-AR',
    'es-CO',
    'es-CL',
    'es-PE',
    'es-VE',
    'fr',
    'fr-FR',
    'fr-CA',
    'fr-BE',
    'fr-CH',
    'de',
    'de-DE',
    'de-AT',
    'de-CH',
    'it',
    'it-IT',
    'it-CH',
    'pt',
    'pt-BR',
    'pt-PT',
    'nl',
    'nl-NL',
    'nl-BE',
    'ru',
    'ru-RU',
    'ja',
    'ja-JP',
    'ko',
    'ko-KR',
    'zh',
    'zh-CN',
    'zh-TW',
    'ar',
    'ar-SA',
    'ar-EG',
    'ar-AE',
    'hi',
    'hi-IN',
    'th',
    'th-TH',
    'vi',
    'vi-VN',
    'tr',
    'tr-TR',
    'pl',
    'pl-PL',
    'cs',
    'cs-CZ',
    'sk',
    'sk-SK',
    'hu',
    'hu-HU',
    'ro',
    'ro-RO',
    'bg',
    'bg-BG',
    'hr',
    'hr-HR',
    'sr',
    'sr-RS',
    'sl',
    'sl-SI',
    'et',
    'et-EE',
    'lv',
    'lv-LV',
    'lt',
    'lt-LT',
    'fi',
    'fi-FI',
    'sv',
    'sv-SE',
    'no',
    'no-NO',
    'da',
    'da-DK',
    'is',
    'is-IS',
    'el',
    'el-GR',
    'he',
    'he-IL',
    'uk',
    'uk-UA',
    'be',
    'be-BY',
    'ka',
    'ka-GE',
    'hy',
    'hy-AM',
    'az',
    'az-AZ',
    'kk',
    'kk-KZ',
    'ky',
    'ky-KG',
    'uz',
    'uz-UZ',
    'mn',
    'mn-MN',
  ]);

  constructor(
    value: string,
    options: {
      allowEmpty?: boolean;
      validateExistence?: boolean;
    } = {},
  ) {
    const processedValue = LocaleValueObject.normalizeLocale(value);

    super(processedValue, {
      minLength: LocaleValueObject.MIN_LENGTH,
      maxLength: LocaleValueObject.MAX_LENGTH,
      allowEmpty: options.allowEmpty ?? false,
      pattern: LocaleValueObject.LOCALE_PATTERN,
      trim: true,
    });

    if (options.validateExistence !== false) {
      // Only validate existence if value is not empty or allowEmpty is false
      if (this.value.length > 0 || options.allowEmpty !== true) {
        this.validateExistence();
      }
    }
  }

  /**
   * Creates a new LocaleValueObject from a string
   * @param locale - The locale string
   * @param options - Validation options
   * @returns A new LocaleValueObject
   */
  public static fromString(
    locale: string,
    options: {
      allowEmpty?: boolean;
      validateExistence?: boolean;
    } = {},
  ): LocaleValueObject {
    return new LocaleValueObject(locale, options);
  }

  /**
   * Normalizes a locale string
   * @param locale - The locale to normalize
   * @returns A normalized locale string
   */
  public static normalizeLocale(locale: string): string {
    if (!locale || typeof locale !== 'string') {
      return '';
    }

    return locale.trim().toLowerCase();
  }

  /**
   * Checks if the locale exists in the common locales list
   * @returns True if the locale exists
   */
  public exists(): boolean {
    return LocaleValueObject.COMMON_LOCALES.has(this.value);
  }

  /**
   * Checks if the locale is a valid format
   * @returns True if valid format
   */
  public isValidFormat(): boolean {
    return LocaleValueObject.LOCALE_PATTERN.test(this.value);
  }

  /**
   * Gets the language code from the locale (e.g., "en" from "en-US")
   * @returns The language code
   */
  public getLanguageCode(): string {
    return this.value.split('-')[0];
  }

  /**
   * Gets the country code from the locale (e.g., "US" from "en-US")
   * @returns The country code or null if not present
   */
  public getCountryCode(): string | null {
    const parts = this.value.split('-');
    return parts.length >= 2 ? parts[1].toUpperCase() : null;
  }

  /**
   * Checks if the locale has a country code
   * @returns True if has country code
   */
  public hasCountryCode(): boolean {
    return this.value.includes('-');
  }

  /**
   * Checks if the locale is English
   * @returns True if English
   */
  public isEnglish(): boolean {
    return this.getLanguageCode() === 'en';
  }

  /**
   * Checks if the locale is Spanish
   * @returns True if Spanish
   */
  public isSpanish(): boolean {
    return this.getLanguageCode() === 'es';
  }

  /**
   * Checks if the locale is French
   * @returns True if French
   */
  public isFrench(): boolean {
    return this.getLanguageCode() === 'fr';
  }

  /**
   * Checks if the locale is German
   * @returns True if German
   */
  public isGerman(): boolean {
    return this.getLanguageCode() === 'de';
  }

  /**
   * Gets the display name for the locale
   * @returns The display name or null if unknown
   */
  public getDisplayName(): string | null {
    const displayNames: Record<string, string> = {
      en: 'English',
      'en-US': 'English (United States)',
      'en-GB': 'English (United Kingdom)',
      'en-CA': 'English (Canada)',
      'en-AU': 'English (Australia)',
      es: 'Spanish',
      'es-ES': 'Spanish (Spain)',
      'es-MX': 'Spanish (Mexico)',
      'es-AR': 'Spanish (Argentina)',
      'es-CO': 'Spanish (Colombia)',
      'es-CL': 'Spanish (Chile)',
      'es-PE': 'Spanish (Peru)',
      'es-VE': 'Spanish (Venezuela)',
      fr: 'French',
      'fr-FR': 'French (France)',
      'fr-CA': 'French (Canada)',
      'fr-BE': 'French (Belgium)',
      'fr-CH': 'French (Switzerland)',
      de: 'German',
      'de-DE': 'German (Germany)',
      'de-AT': 'German (Austria)',
      'de-CH': 'German (Switzerland)',
      it: 'Italian',
      'it-IT': 'Italian (Italy)',
      'it-CH': 'Italian (Switzerland)',
      pt: 'Portuguese',
      'pt-BR': 'Portuguese (Brazil)',
      'pt-PT': 'Portuguese (Portugal)',
      nl: 'Dutch',
      'nl-NL': 'Dutch (Netherlands)',
      'nl-BE': 'Dutch (Belgium)',
      ru: 'Russian',
      'ru-RU': 'Russian (Russia)',
      ja: 'Japanese',
      'ja-JP': 'Japanese (Japan)',
      ko: 'Korean',
      'ko-KR': 'Korean (South Korea)',
      zh: 'Chinese',
      'zh-CN': 'Chinese (China)',
      'zh-TW': 'Chinese (Taiwan)',
      ar: 'Arabic',
      'ar-SA': 'Arabic (Saudi Arabia)',
      'ar-EG': 'Arabic (Egypt)',
      'ar-AE': 'Arabic (United Arab Emirates)',
      hi: 'Hindi',
      'hi-IN': 'Hindi (India)',
      th: 'Thai',
      'th-TH': 'Thai (Thailand)',
      vi: 'Vietnamese',
      'vi-VN': 'Vietnamese (Vietnam)',
      tr: 'Turkish',
      'tr-TR': 'Turkish (Turkey)',
      pl: 'Polish',
      'pl-PL': 'Polish (Poland)',
      cs: 'Czech',
      'cs-CZ': 'Czech (Czech Republic)',
      sk: 'Slovak',
      'sk-SK': 'Slovak (Slovakia)',
      hu: 'Hungarian',
      'hu-HU': 'Hungarian (Hungary)',
      ro: 'Romanian',
      'ro-RO': 'Romanian (Romania)',
      bg: 'Bulgarian',
      'bg-BG': 'Bulgarian (Bulgaria)',
      hr: 'Croatian',
      'hr-HR': 'Croatian (Croatia)',
      sr: 'Serbian',
      'sr-RS': 'Serbian (Serbia)',
      sl: 'Slovenian',
      'sl-SI': 'Slovenian (Slovenia)',
      et: 'Estonian',
      'et-EE': 'Estonian (Estonia)',
      lv: 'Latvian',
      'lv-LV': 'Latvian (Latvia)',
      lt: 'Lithuanian',
      'lt-LT': 'Lithuanian (Lithuania)',
      fi: 'Finnish',
      'fi-FI': 'Finnish (Finland)',
      sv: 'Swedish',
      'sv-SE': 'Swedish (Sweden)',
      no: 'Norwegian',
      'no-NO': 'Norwegian (Norway)',
      da: 'Danish',
      'da-DK': 'Danish (Denmark)',
      is: 'Icelandic',
      'is-IS': 'Icelandic (Iceland)',
      el: 'Greek',
      'el-GR': 'Greek (Greece)',
      he: 'Hebrew',
      'he-IL': 'Hebrew (Israel)',
      uk: 'Ukrainian',
      'uk-UA': 'Ukrainian (Ukraine)',
      be: 'Belarusian',
      'be-BY': 'Belarusian (Belarus)',
      ka: 'Georgian',
      'ka-GE': 'Georgian (Georgia)',
      hy: 'Armenian',
      'hy-AM': 'Armenian (Armenia)',
      az: 'Azerbaijani',
      'az-AZ': 'Azerbaijani (Azerbaijan)',
      kk: 'Kazakh',
      'kk-KZ': 'Kazakh (Kazakhstan)',
      ky: 'Kyrgyz',
      'ky-KG': 'Kyrgyz (Kyrgyzstan)',
      uz: 'Uzbek',
      'uz-UZ': 'Uzbek (Uzbekistan)',
      mn: 'Mongolian',
      'mn-MN': 'Mongolian (Mongolia)',
    };

    return displayNames[this.value] || null;
  }

  /**
   * Validates that the locale exists in the common locales list
   * @throws InvalidLocaleException if locale doesn't exist
   */
  private validateExistence(): void {
    if (!this.exists()) {
      throw new InvalidLocaleException(
        `Locale ${this.value} is not recognized as a valid locale`,
      );
    }
  }
}
