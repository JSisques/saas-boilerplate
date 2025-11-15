import { BaseDomainException } from '@repo/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Hex Exception
 * This exception is thrown when a hexadecimal value is invalid.
 */
export class InvalidHexException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
