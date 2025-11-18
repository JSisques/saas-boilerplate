import { BaseDomainException } from '@repo/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid UUID Exception
 * This exception is thrown when a UUID value is invalid.
 */
export class InvalidUuidException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
