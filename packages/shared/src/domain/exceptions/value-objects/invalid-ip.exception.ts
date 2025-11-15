import { BaseDomainException } from '@repo/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid IP Exception
 * This exception is thrown when an IP address value is invalid.
 */
export class InvalidIpException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
