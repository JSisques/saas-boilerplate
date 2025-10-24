import { BaseEvent } from '@/shared/domain/events/base-integration-event.interface';
import { IUserEventData } from '@/shared/domain/events/users/interfaces/user-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class UserUpdatedEvent extends BaseEvent<
  Partial<Omit<IUserEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IUserEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
