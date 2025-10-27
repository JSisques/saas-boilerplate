import { BaseDomainException } from '../../../domain/exceptions/base-domain.exception';

/**
 * Password Verification Failed Exception
 * Thrown when password verification operation fails
 */
export class PasswordVerificationFailedException extends BaseDomainException {
  public readonly domain: string = 'PasswordHashing';

  constructor(reason?: string) {
    const message = reason
      ? `Password verification failed: ${reason}`
      : 'Password verification failed due to an unknown error';
    super(message);
  }
}
