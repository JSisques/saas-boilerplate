import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISubscriptionEventData } from '@/shared/domain/events/billing-context/subscription/interfaces/subscription-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class SubscriptionUpdatedEvent extends BaseEvent<
  Partial<Omit<ISubscriptionEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ISubscriptionEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
