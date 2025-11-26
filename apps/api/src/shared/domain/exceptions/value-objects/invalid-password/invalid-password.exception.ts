import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Password Exception
 * This exception is thrown when a password value is invalid.
 */
export class InvalidPasswordException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
