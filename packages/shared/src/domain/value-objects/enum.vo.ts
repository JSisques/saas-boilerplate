import { InvalidEnumValueException } from '@repo/shared/domain/exceptions/value-objects/invalid-enum-value.exception';

/**
 * Enum Value Object
 * This abstract class provides a base for enum value objects with validation.
 * It ensures that the enum value is valid and provides utility methods.
 * @param T - The enum type extending Record<string, string | number>
 */
export abstract class EnumValueObject<
  T extends Record<string, string | number>,
> {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: EnumValueObject<T>): boolean {
    return this._value === other.value;
  }

  /**
   * Checks if the current value equals a specific enum value
   * @param enumValue - The enum value to compare with
   * @returns True if equal
   */
  public is(enumValue: string | number): boolean {
    return this._value === String(enumValue);
  }

  /**
   * Checks if the current value is one of the specified enum values
   * @param enumValues - Array of enum values to check against
   * @returns True if current value is in the array
   */
  public isOneOf(enumValues: (string | number)[]): boolean {
    return enumValues.some((val) => this._value === String(val));
  }

  /**
   * Checks if the current value is not one of the specified enum values
   * @param enumValues - Array of enum values to check against
   * @returns True if current value is not in the array
   */
  public isNotOneOf(enumValues: (string | number)[]): boolean {
    return !this.isOneOf(enumValues);
  }

  /**
   * Gets the key name for the current enum value
   * @returns The key name or undefined if not found
   */
  public getKey(): string | undefined {
    return Object.keys(this.enumObject).find(
      (key) => this.enumObject[key] === this._value,
    );
  }

  /**
   * Gets all available enum values
   * @returns Array of all enum values
   */
  public getAllValues(): (string | number)[] {
    return Object.values(this.enumObject);
  }

  /**
   * Gets all available enum keys
   * @returns Array of all enum keys
   */
  public getAllKeys(): string[] {
    return Object.keys(this.enumObject);
  }

  /**
   * Gets all available enum entries
   * @returns Array of [key, value] pairs
   */
  public getAllEntries(): [string, string | number][] {
    return Object.entries(this.enumObject);
  }

  /**
   * Checks if a value is valid for this enum
   * @param value - The value to check
   * @returns True if valid
   */
  public isValidValue(value: string | number): boolean {
    return Object.values(this.enumObject).includes(value);
  }

  /**
   * Gets a random enum value
   * @returns A random valid enum value
   */
  public getRandomValue(): string | number {
    const values = Object.values(this.enumObject);
    return values[Math.floor(Math.random() * values.length)];
  }

  /**
   * Gets the next enum value in sequence
   * @returns The next enum value or the first if current is last
   */
  public getNextValue(): string | number {
    const values = Object.values(this.enumObject);
    const currentIndex = values.indexOf(this._value);
    const nextIndex = (currentIndex + 1) % values.length;
    return values[nextIndex];
  }

  /**
   * Gets the previous enum value in sequence
   * @returns The previous enum value or the last if current is first
   */
  public getPreviousValue(): string | number {
    const values = Object.values(this.enumObject);
    const currentIndex = values.indexOf(this._value);
    const previousIndex =
      currentIndex === 0 ? values.length - 1 : currentIndex - 1;
    return values[previousIndex];
  }

  /**
   * Gets the index of the current value in the enum
   * @returns The index of the current value
   */
  public getIndex(): number {
    return Object.values(this.enumObject).indexOf(this._value);
  }

  /**
   * Gets the total number of enum values
   * @returns The total count of enum values
   */
  public getCount(): number {
    return Object.keys(this.enumObject).length;
  }

  /**
   * Converts the enum value to a human-readable string
   * @returns A formatted string representation
   */
  public toDisplayString(): string {
    const key = this.getKey();
    if (!key) return this._value;

    // Convert camelCase/PascalCase to readable format
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Converts the enum value to a slug format
   * @returns A slug representation (lowercase, hyphen-separated)
   */
  public toSlug(): string {
    const key = this.getKey();
    if (!key) return this._value.toLowerCase();

    return key
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Converts the enum value to a constant format
   * @returns A constant representation (uppercase, underscore-separated)
   */
  public toConstant(): string {
    const key = this.getKey();
    if (!key) return this._value.toUpperCase();

    return key
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()
      .replace(/^_/, '');
  }

  /**
   * Creates a new enum value object with a different value
   * @param value - The new enum value
   * @returns A new instance with the specified value
   */
  public withValue(value: string): this {
    return new (this.constructor as new (value: string) => this)(value);
  }

  /**
   * Creates a new enum value object with the next value
   * @returns A new instance with the next value
   */
  public withNextValue(): this {
    return this.withValue(String(this.getNextValue()));
  }

  /**
   * Creates a new enum value object with the previous value
   * @returns A new instance with the previous value
   */
  public withPreviousValue(): this {
    return this.withValue(String(this.getPreviousValue()));
  }

  /**
   * Creates a new enum value object with a random value
   * @returns A new instance with a random value
   */
  public withRandomValue(): this {
    return this.withValue(String(this.getRandomValue()));
  }

  /**
   * Gets the enum value as a number if it's numeric
   * @returns The numeric value or NaN if not numeric
   */
  public toNumber(): number {
    return Number(this._value);
  }

  /**
   * Checks if the enum value is numeric
   * @returns True if the value is numeric
   */
  public isNumeric(): boolean {
    return !isNaN(Number(this._value));
  }

  /**
   * Gets a description of the enum value
   * @returns A description string
   */
  public getDescription(): string {
    return `${this.constructor.name}.${this.getKey() || this._value}`;
  }

  /**
   * Serializes the enum value to JSON
   * @returns JSON representation
   */
  public toJSON(): string {
    return JSON.stringify({
      type: this.constructor.name,
      value: this._value,
      key: this.getKey(),
    });
  }

  /**
   * Creates an enum value object from JSON
   * @param json - JSON string or object
   * @returns A new enum value object
   */
  public static fromJSON<
    T extends EnumValueObject<Record<string, string | number>>,
  >(this: new (value: string) => T, json: string | { value: string }): T {
    const data =
      typeof json === 'string' ? (JSON.parse(json) as { value: string }) : json;
    return new this(data.value);
  }

  protected abstract get enumObject(): T;

  protected validate(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidEnumValueException(
        `Enum value cannot be empty for ${this.constructor.name}`,
      );
    }

    const enumValues = Object.values(this.enumObject);
    if (!enumValues.includes(value)) {
      throw new InvalidEnumValueException(
        `Invalid value for ${this.constructor.name}: ${value}. Valid values are: ${enumValues.join(', ')}`,
      );
    }
  }

  protected get enumValues(): (string | number)[] {
    return Object.values(this.enumObject);
  }
}
