import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

/**
 * Invalid Salt Rounds Exception
 * Thrown when salt rounds value is outside the valid range
 */
export class InvalidSaltRoundsException extends BaseDomainException {
  constructor(rounds: number) {
    const message = `Invalid salt rounds: ${rounds}. Salt rounds must be between 4 and 31`;
    super(message);
  }
}
