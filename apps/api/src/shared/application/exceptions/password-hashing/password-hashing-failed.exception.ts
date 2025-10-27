import { BaseDomainException } from '../../../domain/exceptions/base-domain.exception';

/**
 * Password Hashing Failed Exception
 * Thrown when password hashing operation fails
 */
export class PasswordHashingFailedException extends BaseDomainException {
  public readonly domain: string = 'PasswordHashing';

  constructor(reason?: string) {
    const message = reason
      ? `Password hashing failed: ${reason}`
      : 'Password hashing failed due to an unknown error';
    super(message);
  }
}
