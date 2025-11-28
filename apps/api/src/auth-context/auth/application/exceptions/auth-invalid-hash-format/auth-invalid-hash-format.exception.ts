import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Hash Format Exception
 * Thrown when a hash string is not in the expected format
 */
export class InvalidHashFormatException extends BaseDomainException {
  constructor(hash?: string) {
    const message = hash
      ? `Invalid hash format: ${hash}`
      : 'Invalid hash format provided';
    super(message);
  }
}
