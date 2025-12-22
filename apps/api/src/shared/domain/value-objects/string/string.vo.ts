import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

/**
 * String Value Object
 * This value object is responsible for encapsulating string values with validation.
 * It ensures that the string meets specified requirements.
 * @param value - The string value.
 * @param options - Validation options for the string.
 * @returns A new instance of the StringValueObject.
 */
export class StringValueObject {
  private readonly _value: string;

  constructor(
    value: string,
    private readonly options: {
      minLength?: number;
      maxLength?: number;
      allowEmpty?: boolean;
      trim?: boolean;
      pattern?: RegExp;
      caseSensitive?: boolean;
    } = {},
  ) {
    this._value = this.processValue(value);
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: StringValueObject): boolean {
    if (this.options.caseSensitive === false) {
      return this._value.toLowerCase() === other.value.toLowerCase();
    }
    return this._value === other.value;
  }

  /**
   * Checks if the string is empty
   * @returns True if empty
   */
  public isEmpty(): boolean {
    return this._value.length === 0;
  }

  /**
   * Checks if the string is not empty
   * @returns True if not empty
   */
  public isNotEmpty(): boolean {
    return this._value.length > 0;
  }

  /**
   * Gets the length of the string
   * @returns The string length
   */
  public length(): number {
    return this._value.length;
  }

  /**
   * Checks if the string contains a substring
   * @param substring - The substring to search for
   * @returns True if contains the substring
   */
  public contains(substring: string): boolean {
    if (this.options.caseSensitive === false) {
      return this._value.toLowerCase().includes(substring.toLowerCase());
    }
    return this._value.includes(substring);
  }

  /**
   * Checks if the string starts with a prefix
   * @param prefix - The prefix to check
   * @returns True if starts with the prefix
   */
  public startsWith(prefix: string): boolean {
    if (this.options.caseSensitive === false) {
      return this._value.toLowerCase().startsWith(prefix.toLowerCase());
    }
    return this._value.startsWith(prefix);
  }

  /**
   * Checks if the string ends with a suffix
   * @param suffix - The suffix to check
   * @returns True if ends with the suffix
   */
  public endsWith(suffix: string): boolean {
    if (this.options.caseSensitive === false) {
      return this._value.toLowerCase().endsWith(suffix.toLowerCase());
    }
    return this._value.endsWith(suffix);
  }

  /**
   * Converts the string to lowercase
   * @returns A new StringValueObject in lowercase
   */
  public toLowerCase(): StringValueObject {
    return new StringValueObject(this._value.toLowerCase(), this.options);
  }

  /**
   * Converts the string to uppercase
   * @returns A new StringValueObject in uppercase
   */
  public toUpperCase(): StringValueObject {
    return new StringValueObject(this._value.toUpperCase(), this.options);
  }

  /**
   * Capitalizes the first letter of the string
   * @returns A new StringValueObject with first letter capitalized
   */
  public capitalize(): StringValueObject {
    if (this._value.length === 0) {
      return new StringValueObject(this._value, this.options);
    }
    const capitalized =
      this._value.charAt(0).toUpperCase() + this._value.slice(1).toLowerCase();
    return new StringValueObject(capitalized, this.options);
  }

  /**
   * Trims whitespace from both ends
   * @returns A new StringValueObject with trimmed whitespace
   */
  public trim(): StringValueObject {
    return new StringValueObject(this._value.trim(), this.options);
  }

  /**
   * Replaces all occurrences of a substring
   * @param searchValue - The substring to replace
   * @param replaceValue - The replacement string
   * @returns A new StringValueObject with replacements
   */
  public replace(searchValue: string, replaceValue: string): StringValueObject {
    let result = this._value;
    if (this.options.caseSensitive === false) {
      const regex = new RegExp(
        searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi',
      );
      result = this._value.replace(regex, replaceValue);
    } else {
      result = this._value.replace(
        new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        replaceValue,
      );
    }
    return new StringValueObject(result, this.options);
  }

  /**
   * Splits the string by a delimiter
   * @param delimiter - The delimiter to split by
   * @returns Array of StringValueObjects
   */
  public split(delimiter: string): StringValueObject[] {
    return this._value
      .split(delimiter)
      .map((part) => new StringValueObject(part, this.options));
  }

  /**
   * Checks if the string matches a pattern
   * @param pattern - The regex pattern to match
   * @returns True if matches the pattern
   */
  public matches(pattern: RegExp): boolean {
    return pattern.test(this._value);
  }

  /**
   * Checks if the string is a valid email format
   * @returns True if valid email format
   */
  public isEmail(): boolean {
    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailPattern.test(this._value);
  }

  /**
   * Checks if the string is a valid URL format
   * @returns True if valid URL format
   */
  public isUrl(): boolean {
    try {
      new URL(this._value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if the string is numeric
   * @returns True if numeric
   */
  public isNumeric(): boolean {
    return !isNaN(Number(this._value)) && !isNaN(parseFloat(this._value));
  }

  /**
   * Checks if the string is alphanumeric
   * @returns True if alphanumeric
   */
  public isAlphanumeric(): boolean {
    return /^[a-zA-Z0-9]+$/.test(this._value);
  }

  /**
   * Checks if the string is alphabetic only
   * @returns True if alphabetic only
   */
  public isAlphabetic(): boolean {
    return /^[a-zA-Z]+$/.test(this._value);
  }

  private processValue(value: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    let processedValue = String(value);

    if (this.options.trim !== false) {
      processedValue = processedValue.trim();
    }

    return processedValue;
  }

  private validate(): void {
    this.checkEmpty();
    this.checkLength();
    this.checkPattern();
  }

  private checkEmpty(): void {
    if (this.options.allowEmpty === false && this._value.length === 0) {
      throw new InvalidStringException('String cannot be empty');
    }
  }

  private checkLength(): void {
    // Skip minLength validation if allowEmpty is true and value is empty
    if (
      this.options.minLength !== undefined &&
      this._value.length < this.options.minLength &&
      !(this.options.allowEmpty === true && this._value.length === 0)
    ) {
      throw new InvalidStringException(
        `String must be at least ${this.options.minLength} characters long`,
      );
    }

    if (
      this.options.maxLength !== undefined &&
      this._value.length > this.options.maxLength
    ) {
      throw new InvalidStringException(
        `String must be at most ${this.options.maxLength} characters long`,
      );
    }
  }

  private checkPattern(): void {
    if (this.options.pattern && !this.options.pattern.test(this._value)) {
      throw new InvalidStringException(
        'String does not match required pattern',
      );
    }
  }
}
