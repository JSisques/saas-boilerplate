import { BaseDomainException } from '@repo/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid JSON Exception
 * This exception is thrown when a JSON value is invalid.
 */
export class InvalidJsonException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
