import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class AuthUpdatedEvent extends BaseEvent<
  Partial<Omit<IAuthEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IAuthEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
