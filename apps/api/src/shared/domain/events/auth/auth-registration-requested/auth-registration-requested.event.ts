import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class AuthRegistrationRequestedEvent extends BaseEvent<IAuthEventData> {
  constructor(metadata: IEventMetadata, data: IAuthEventData) {
    super(metadata, data);
  }
}
