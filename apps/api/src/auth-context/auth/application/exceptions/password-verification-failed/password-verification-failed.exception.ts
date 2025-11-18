import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

/**
 * Password Verification Failed Exception
 * Thrown when password verification operation fails
 */
export class PasswordVerificationFailedException extends BaseApplicationException {
  constructor() {
    super('Password verification failed');
  }
}
