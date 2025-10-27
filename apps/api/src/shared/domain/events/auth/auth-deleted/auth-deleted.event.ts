import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Auth deleted event
 *
 * @class AuthDeletedEvent
 * @extends {BaseEvent<IAuthEventData>}
 * @param metadata - The metadata of the event
 * @param data - The data of the event
 */
export class AuthDeletedEvent extends BaseEvent<IAuthEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IAuthEventData) {
    super(metadata, data);
  }
}
