import { BaseIntegrationEvent } from '@/shared/application/integration-events/base-integration-event.interface';
import { UserIntegrationEventData } from '@/shared/application/integration-events/users/interfaces/user-integration-event-data.interface';
import { EventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class UserUpdatedIntegrationEvent extends BaseIntegrationEvent<
  Partial<Omit<UserIntegrationEventData, 'id'>>
> {
  constructor(
    metadata: EventMetadata,
    data: Partial<Omit<UserIntegrationEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
