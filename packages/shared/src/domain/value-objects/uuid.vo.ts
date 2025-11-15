import { InvalidUuidException } from '@repo/shared/domain/exceptions/value-objects/invalid-uuid.exception';
import { randomUUID } from 'crypto';

/**
 * UUID Value Object
 * This value object is responsible for encapsulating UUID values.
 * It ensures that the UUID is valid according to RFC 4122 standards.
 * @param value - The UUID string.
 * @returns A new instance of the UuidValueObject.
 */
export class UuidValueObject {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
    this.validate(this._value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: UuidValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Gets the version of the UUID (1-5)
   * @returns The version number or null if not a standard UUID
   */
  public getVersion(): number | null {
    const match = this._value.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    if (match) {
      return parseInt(match[1], 16);
    }
    return null;
  }

  /**
   * Checks if the UUID is a nil UUID (all zeros)
   * @returns True if it's a nil UUID
   */
  public isNil(): boolean {
    return this._value === '00000000-0000-0000-0000-000000000000';
  }

  /**
   * Generates a new random UUID
   * @returns A new UuidValueObject with a random UUID
   */
  public static generate(): UuidValueObject {
    return new UuidValueObject();
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkIsValidUuid(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidUuidException('UUID cannot be empty');
    }
  }

  private checkIsValidUuid(value: string): void {
    // RFC 4122 compliant UUID regex
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(value)) {
      throw new InvalidUuidException('Invalid UUID format');
    }
  }
}
