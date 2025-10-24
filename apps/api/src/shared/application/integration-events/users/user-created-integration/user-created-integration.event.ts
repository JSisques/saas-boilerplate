import { BaseIntegrationEvent } from '@/shared/application/integration-events/base-integration-event.interface';
import { UserIntegrationEventData } from '@/shared/application/integration-events/users/interfaces/user-integration-event-data.interface';
import { EventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class UserCreatedIntegrationEvent extends BaseIntegrationEvent<UserIntegrationEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: EventMetadata, data: UserIntegrationEventData) {
    super(metadata, data);
  }
}
