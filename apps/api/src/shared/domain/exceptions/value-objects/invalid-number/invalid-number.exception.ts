import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Number Exception
 * This exception is thrown when a number value is invalid.
 */
export class InvalidNumberException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
