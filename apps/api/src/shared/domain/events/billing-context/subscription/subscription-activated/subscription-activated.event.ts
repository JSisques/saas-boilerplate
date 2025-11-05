import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISubscriptionEventData } from '@/shared/domain/events/billing-context/subscription/interfaces/subscription-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class SubscriptionActivatedEvent extends BaseEvent<ISubscriptionEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ISubscriptionEventData) {
    super(metadata, data);
  }
}
