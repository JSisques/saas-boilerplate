import { InvalidPasswordException } from '@/shared/domain/exceptions/value-objects/invalid-password/invalid-password.exception';

/**
 * Password Value Object
 * This value object is responsible for encapsulating passwords.
 * It ensures that the password meets security requirements.
 * @param value - The password string.
 * @returns A new instance of the PasswordValueObject.
 */
export class PasswordValueObject {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: PasswordValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Gets the strength score of the password (0-100)
   * @returns The password strength score
   */
  public getStrengthScore(): number {
    let score = 0;

    // Length bonus
    if (this._value.length >= 8) score += 20;
    if (this._value.length >= 12) score += 10;
    if (this._value.length >= 16) score += 10;

    // Character variety bonus
    if (/[a-z]/.test(this._value)) score += 10;
    if (/[A-Z]/.test(this._value)) score += 10;
    if (/[0-9]/.test(this._value)) score += 10;
    if (/[^a-zA-Z0-9]/.test(this._value)) score += 20;

    // Pattern penalties
    if (/(.)\1{2,}/.test(this._value)) score -= 10; // Repeated characters
    if (/123|abc|qwe/i.test(this._value)) score -= 10; // Common sequences

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Gets the strength level of the password
   * @returns The password strength level
   */
  public getStrengthLevel(): 'weak' | 'medium' | 'strong' | 'very-strong' {
    const score = this.getStrengthScore();
    if (score < 30) return 'weak';
    if (score < 60) return 'medium';
    if (score < 80) return 'strong';
    return 'very-strong';
  }

  /**
   * Checks if the password meets minimum requirements
   * @returns True if password meets requirements
   */
  public meetsRequirements(): boolean {
    return (
      this._value.length >= 8 &&
      /[a-z]/.test(this._value) &&
      /[A-Z]/.test(this._value) &&
      /[0-9]/.test(this._value)
    );
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkMinimumLength(value);
    this.checkCommonPasswords(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidPasswordException('Password cannot be empty');
    }
  }

  private checkMinimumLength(value: string): void {
    if (value.length < 8) {
      throw new InvalidPasswordException(
        'Password must be at least 8 characters long',
      );
    }
  }

  private checkCommonPasswords(value: string): void {
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
    ];

    if (commonPasswords.includes(value.toLowerCase())) {
      throw new InvalidPasswordException(
        'Password is too common, please choose a stronger password',
      );
    }
  }
}
