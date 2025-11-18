import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Boolean Exception
 * This exception is thrown when a boolean value is invalid.
 */
export class InvalidBooleanException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
    this.name = InvalidBooleanException.name;
  }
}
