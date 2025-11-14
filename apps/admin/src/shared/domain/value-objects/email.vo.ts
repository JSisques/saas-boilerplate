import { InvalidEmailException } from '@/shared/domain/exceptions/value-objects/invalid-email.exception';

/**
 * Email Value Object
 * This value object is responsible for encapsulating email addresses.
 * It ensures that the email is valid according to RFC 5322 standards.
 * @param value - The email address.
 * @returns A new instance of the EmailValueObject.
 */
export class EmailValueObject {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: EmailValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Gets the local part of the email (before @)
   * @returns The local part of the email
   */
  public getLocalPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * Gets the domain part of the email (after @)
   * @returns The domain part of the email
   */
  public getDomain(): string {
    return this._value.split('@')[1];
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkIsValidEmail(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidEmailException('Email cannot be empty');
    }
  }

  private checkIsValidEmail(value: string): void {
    // RFC 5322 compliant email regex
    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailPattern.test(value)) {
      throw new InvalidEmailException('Invalid email format');
    }

    // Additional checks
    if (value.length > 254) {
      throw new InvalidEmailException('Email is too long (max 254 characters)');
    }

    const localPart = value.split('@')[0];
    if (localPart.length > 64) {
      throw new InvalidEmailException(
        'Local part of email is too long (max 64 characters)',
      );
    }
  }
}
