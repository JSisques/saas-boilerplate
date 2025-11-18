import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * InvalidLocaleException
 * Exception thrown when a locale value is invalid
 */
export class InvalidLocaleException extends BaseDomainException {
  constructor(message: string) {
    super(message);
    this.name = InvalidLocaleException.name;
  }
}
