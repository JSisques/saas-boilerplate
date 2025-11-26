import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class EventFailedToRegisterDomainEventsException extends BaseDomainException {
  constructor(file: string, error?: Error) {
    const errorMessage = error ? ` with error: ${error}` : '<no stack trace>';
    super(
      `Failed to register domain events from file ${file} with error: ${errorMessage}`,
    );
  }
}
