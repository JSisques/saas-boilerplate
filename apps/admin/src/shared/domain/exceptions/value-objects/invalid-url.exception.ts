import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid URL Exception
 * This exception is thrown when a URL value is invalid.
 */
export class InvalidUrlException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
