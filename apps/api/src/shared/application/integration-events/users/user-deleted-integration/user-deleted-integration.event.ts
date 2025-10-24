import { BaseIntegrationEvent } from '@/shared/application/integration-events/base-integration-event.interface';
import { UserIntegrationEventData } from '@/shared/application/integration-events/users/interfaces/user-integration-event-data.interface';
import { EventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class UserDeletedIntegrationEvent extends BaseIntegrationEvent<UserIntegrationEventData> {
  constructor(metadata: EventMetadata, data: UserIntegrationEventData) {
    super(metadata, data);
  }
}
