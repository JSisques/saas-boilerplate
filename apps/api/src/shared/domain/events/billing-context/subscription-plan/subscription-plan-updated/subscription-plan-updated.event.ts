import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISubscriptionPlanEventData } from '@/shared/domain/events/billing-context/subscription-plan/interfaces/subscription-plan-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class SubscriptionPlanUpdatedEvent extends BaseEvent<
  Partial<Omit<ISubscriptionPlanEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<ISubscriptionPlanEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
