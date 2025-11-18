import { InvalidStringException } from '@repo/shared/domain/exceptions/value-objects/invalid-string.exception';
import { StringValueObject } from '@repo/shared/domain/value-objects/string.vo';

/**
 * Slug Value Object
 * This value object is responsible for encapsulating slug values with validation and generation.
 * It ensures that the slug meets URL-friendly requirements and can generate slugs from strings.
 * @param value - The slug value or string to generate slug from.
 * @param options - Validation options for the slug.
 * @returns A new instance of the SlugValueObject.
 */
export class SlugValueObject extends StringValueObject {
  private static readonly SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  constructor(
    value: string,
    options: {
      minLength?: number;
      maxLength?: number;
      allowEmpty?: boolean;
      generateFromString?: boolean;
    } = {},
  ) {
    const processedValue = options.generateFromString
      ? SlugValueObject.generateSlug(value)
      : value;

    super(processedValue, {
      minLength: options.minLength ?? SlugValueObject.MIN_LENGTH,
      maxLength: options.maxLength ?? SlugValueObject.MAX_LENGTH,
      allowEmpty: options.allowEmpty ?? false,
      pattern: SlugValueObject.SLUG_PATTERN,
      trim: true,
    });
  }

  /**
   * Creates a new SlugValueObject from a string by generating a slug
   * @param text - The text to generate slug from
   * @param options - Validation options
   * @returns A new SlugValueObject with generated slug
   */
  public static fromString(
    text: string,
    options: {
      minLength?: number;
      maxLength?: number;
      allowEmpty?: boolean;
    } = {},
  ): SlugValueObject {
    return new SlugValueObject(text, {
      ...options,
      generateFromString: true,
    });
  }

  /**
   * Generates a URL-friendly slug from a string
   * @param text - The text to convert to slug
   * @returns A URL-friendly slug string
   */
  public static generateSlug(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return (
      text
        .toLowerCase()
        .trim()
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, '-')
        // Remove all non-alphanumeric characters except hyphens
        .replace(/[^a-z0-9-]/g, '')
        // Replace multiple consecutive hyphens with single hyphen
        .replace(/-+/g, '-')
        // Remove leading and trailing hyphens
        .replace(/^-+|-+$/g, '')
    );
  }

  /**
   * Checks if the current value is a valid slug format
   * @returns True if valid slug format
   */
  public isValidSlug(): boolean {
    return SlugValueObject.SLUG_PATTERN.test(this.value);
  }

  /**
   * Checks if the slug is empty or only contains hyphens
   * @returns True if empty or only hyphens
   */
  public isEmptyOrOnlyHyphens(): boolean {
    return this.value.length === 0 || /^-+$/.test(this.value);
  }

  /**
   * Gets the word count in the slug (counting hyphen-separated parts)
   * @returns Number of words in the slug
   */
  public getWordCount(): number {
    if (this.value.length === 0) return 0;
    return this.value.split('-').filter((part) => part.length > 0).length;
  }

  /**
   * Converts the slug to a human-readable format (title case)
   * @returns A new StringValueObject with human-readable format
   */
  public toHumanReadable(): StringValueObject {
    const humanReadable = this.value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return new StringValueObject(humanReadable);
  }

  /**
   * Adds a suffix to the slug
   * @param suffix - The suffix to add
   * @returns A new SlugValueObject with the suffix
   */
  public addSuffix(suffix: string): SlugValueObject {
    const cleanSuffix = SlugValueObject.generateSlug(suffix);
    if (!cleanSuffix) {
      return this;
    }

    const newSlug = `${this.value}-${cleanSuffix}`;
    return new SlugValueObject(newSlug);
  }

  /**
   * Adds a prefix to the slug
   * @param prefix - The prefix to add
   * @returns A new SlugValueObject with the prefix
   */
  public addPrefix(prefix: string): SlugValueObject {
    const cleanPrefix = SlugValueObject.generateSlug(prefix);
    if (!cleanPrefix) {
      return this;
    }

    const newSlug = `${cleanPrefix}-${this.value}`;
    return new SlugValueObject(newSlug);
  }

  /**
   * Validates that the slug meets all requirements
   * @throws InvalidStringException if validation fails
   */
  protected validateSlug(): void {
    if (this.isEmptyOrOnlyHyphens()) {
      throw new InvalidStringException(
        'Slug cannot be empty or contain only hyphens',
      );
    }

    if (!this.isValidSlug()) {
      throw new InvalidStringException(
        'Slug must contain only lowercase letters, numbers, and hyphens',
      );
    }

    if (this.value.startsWith('-') || this.value.endsWith('-')) {
      throw new InvalidStringException('Slug cannot start or end with hyphens');
    }
  }
}
