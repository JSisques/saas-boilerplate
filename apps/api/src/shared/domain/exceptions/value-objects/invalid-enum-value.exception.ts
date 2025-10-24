import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Enum Value Exception
 * This exception is thrown when an enum value is invalid.
 */
export class InvalidEnumValueException extends BaseDomainException {
  public readonly domain: string = 'ValueObject';

  constructor(message: string) {
    super(message);
  }
}
