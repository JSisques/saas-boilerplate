import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class EventUnsupportedEventTypeException extends BaseDomainException {
  constructor(eventType: string) {
    super(`Unsupported eventType for replay: ${eventType}`);
  }
}
