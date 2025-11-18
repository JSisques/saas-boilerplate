import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

/**
 * Password Hashing Failed Exception
 * Thrown when password hashing operation fails
 */
export class PasswordHashingFailedException extends BaseApplicationException {
  constructor() {
    super('Password hashing failed');
  }
}
