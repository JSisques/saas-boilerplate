import { BaseDomainException } from '@repo/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid String Exception
 * This exception is thrown when a string value is invalid.
 */
export class InvalidStringException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
