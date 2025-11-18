import { InvalidBooleanException } from '@/shared/domain/exceptions/value-objects/invalid-boolean/invalid-boolean.exception';

/**
 * Boolean Value Object
 * This value object is responsible for encapsulating boolean values with validation.
 * It ensures that the boolean value meets specified requirements.
 * @param value - The boolean value.
 * @param options - Validation options for the boolean.
 * @returns A new instance of the BooleanValueObject.
 */
export class BooleanValueObject {
  private readonly _value: boolean;

  constructor(
    value: boolean | string | number,
    private readonly options: {
      allowNull?: boolean;
      allowUndefined?: boolean;
      strictMode?: boolean;
    } = {},
  ) {
    this._value = this.parseValue(value);
    this.validate();
  }

  public get value(): boolean {
    return this._value;
  }

  public equals(other: BooleanValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Checks if the boolean is true
   * @returns True if the value is true
   */
  public isTrue(): boolean {
    return this._value === true;
  }

  /**
   * Checks if the boolean is false
   * @returns True if the value is false
   */
  public isFalse(): boolean {
    return this._value === false;
  }

  /**
   * Negates the boolean value
   * @returns A new BooleanValueObject with negated value
   */
  public not(): BooleanValueObject {
    return new BooleanValueObject(!this._value, this.options);
  }

  /**
   * Performs logical AND operation
   * @param other - Another BooleanValueObject
   * @returns A new BooleanValueObject with AND result
   */
  public and(other: BooleanValueObject): BooleanValueObject {
    return new BooleanValueObject(this._value && other._value, this.options);
  }

  /**
   * Performs logical OR operation
   * @param other - Another BooleanValueObject
   * @returns A new BooleanValueObject with OR result
   */
  public or(other: BooleanValueObject): BooleanValueObject {
    return new BooleanValueObject(this._value || other._value, this.options);
  }

  /**
   * Performs logical XOR operation
   * @param other - Another BooleanValueObject
   * @returns A new BooleanValueObject with XOR result
   */
  public xor(other: BooleanValueObject): BooleanValueObject {
    return new BooleanValueObject(this._value !== other._value, this.options);
  }

  /**
   * Converts the boolean to string representation
   * @returns String representation of the boolean
   */
  public toString(): string {
    return this._value.toString();
  }

  /**
   * Converts the boolean to number representation
   * @returns Number representation (1 for true, 0 for false)
   */
  public toNumber(): number {
    return this._value ? 1 : 0;
  }

  /**
   * Creates a BooleanValueObject from a string
   * @param value - String value to convert
   * @returns A new BooleanValueObject
   */
  public static fromString(value: string): BooleanValueObject {
    return new BooleanValueObject(value);
  }

  /**
   * Creates a BooleanValueObject from a number
   * @param value - Number value to convert
   * @returns A new BooleanValueObject
   */
  public static fromNumber(value: number): BooleanValueObject {
    return new BooleanValueObject(value);
  }

  /**
   * Creates a true BooleanValueObject
   * @returns A new BooleanValueObject with true value
   */
  public static true(): BooleanValueObject {
    return new BooleanValueObject(true);
  }

  /**
   * Creates a false BooleanValueObject
   * @returns A new BooleanValueObject with false value
   */
  public static false(): BooleanValueObject {
    return new BooleanValueObject(false);
  }

  private parseValue(value: boolean | string | number): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();

      if (this.options.strictMode) {
        if (lowerValue === 'true') return true;
        if (lowerValue === 'false') return false;
        throw new InvalidBooleanException(`Invalid boolean string: ${value}`);
      }

      // More flexible parsing
      if (['true', '1', 'yes', 'on', 'enabled'].includes(lowerValue)) {
        return true;
      }
      if (['false', '0', 'no', 'off', 'disabled'].includes(lowerValue)) {
        return false;
      }

      throw new InvalidBooleanException(
        `Cannot convert string to boolean: ${value}`,
      );
    }

    if (typeof value === 'number') {
      if (this.options.strictMode) {
        if (value === 1) return true;
        if (value === 0) return false;
        throw new InvalidBooleanException(`Invalid boolean number: ${value}`);
      }

      // More flexible parsing
      if (value === 1 || value > 0) return true;
      if (value === 0) return false;

      throw new InvalidBooleanException(
        `Cannot convert number to boolean: ${value}`,
      );
    }

    if (value === null && this.options.allowNull) {
      return false;
    }

    if (value === undefined && this.options.allowUndefined) {
      return false;
    }

    throw new InvalidBooleanException(`Invalid boolean value: ${value}`);
  }

  private validate(): void {
    // Additional validation can be added here if needed
    // For now, the parsing logic handles most validation
  }
}
