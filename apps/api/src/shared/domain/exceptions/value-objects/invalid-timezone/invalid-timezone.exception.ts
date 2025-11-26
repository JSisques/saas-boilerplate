import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * InvalidTimezoneException
 * Exception thrown when a timezone value is invalid
 */
export class InvalidTimezoneException extends BaseDomainException {
  constructor(message: string) {
    super(message);
    this.name = InvalidTimezoneException.name;
  }
}
