import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number.exception';

/**
 * Number Value Object
 * This value object is responsible for encapsulating numeric values with constraints.
 * It ensures that the number meets specified requirements.
 * @param value - The numeric value.
 * @returns A new instance of the NumberValueObject.
 */
export class NumberValueObject {
  private readonly _value: number;

  constructor(
    value: number | string,
    private readonly options: {
      min?: number;
      max?: number;
      allowDecimals?: boolean;
      precision?: number;
    } = {},
  ) {
    this._value = this.parseValue(value);
    this.validate();
  }

  public get value(): number {
    return this._value;
  }

  public equals(other: NumberValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Checks if the number is within the specified range
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns True if within range
   */
  public isInRange(min: number, max: number): boolean {
    return this._value >= min && this._value <= max;
  }

  /**
   * Checks if the number is positive
   * @returns True if positive
   */
  public isPositive(): boolean {
    return this._value > 0;
  }

  /**
   * Checks if the number is negative
   * @returns True if negative
   */
  public isNegative(): boolean {
    return this._value < 0;
  }

  /**
   * Checks if the number is zero
   * @returns True if zero
   */
  public isZero(): boolean {
    return this._value === 0;
  }

  /**
   * Rounds the number to the specified precision
   * @param precision - Number of decimal places
   * @returns Rounded number
   */
  public round(precision: number = 2): number {
    return (
      Math.round(this._value * Math.pow(10, precision)) /
      Math.pow(10, precision)
    );
  }

  private parseValue(value: number | string): number {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        throw new InvalidNumberException('Invalid number format');
      }
      return parsed;
    }
    return value;
  }

  private validate(): void {
    this.checkIsFinite();
    this.checkRange();
    this.checkDecimals();
  }

  private checkIsFinite(): void {
    if (!isFinite(this._value)) {
      throw new InvalidNumberException('Number must be finite');
    }
  }

  private checkRange(): void {
    if (this.options.min !== undefined && this._value < this.options.min) {
      throw new InvalidNumberException(
        `Number must be at least ${this.options.min}`,
      );
    }

    if (this.options.max !== undefined && this._value > this.options.max) {
      throw new InvalidNumberException(
        `Number must be at most ${this.options.max}`,
      );
    }
  }

  private checkDecimals(): void {
    if (
      this.options.allowDecimals === false &&
      !Number.isInteger(this._value)
    ) {
      throw new InvalidNumberException('Number must be an integer');
    }

    if (this.options.precision !== undefined) {
      const decimalPlaces = (this._value.toString().split('.')[1] || '').length;
      if (decimalPlaces > this.options.precision) {
        throw new InvalidNumberException(
          `Number cannot have more than ${this.options.precision} decimal places`,
        );
      }
    }
  }
}
