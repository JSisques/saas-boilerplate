import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IUserEventData } from '@/shared/domain/events/users/interfaces/user-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * User deleted event
 *
 * @class UserDeletedEvent
 * @extends {BaseEvent<UserIntegrationEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class UserDeletedEvent extends BaseEvent<IUserEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IUserEventData) {
    super(metadata, data);
  }
}
