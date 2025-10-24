import { InvalidHexException } from '@/shared/domain/exceptions/value-objects/invalid-hex.exception';

/**
 * Hex Value Object
 * This value object is responsible for encapsulating hexadecimal values.
 * It ensures that the value is a valid hexadecimal string.
 * @param value - The hexadecimal string.
 * @returns A new instance of the HexValueObject.
 */
export class HexValueObject {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: HexValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Converts the hex value to a number
   * @returns The numeric representation of the hex value
   */
  public toNumber(): number {
    return parseInt(this._value, 16);
  }

  /**
   * Converts the hex value to a buffer
   * @returns The buffer representation of the hex value
   */
  public toBuffer(): Buffer {
    return Buffer.from(this._value, 'hex');
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkIsHex(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidHexException('Hex value cannot be empty');
    }
  }

  private checkIsHex(value: string): void {
    const hexPattern = /^[0-9a-fA-F]+$/;
    if (!hexPattern.test(value)) {
      throw new InvalidHexException('Value must be a valid hexadecimal string');
    }
  }
}
