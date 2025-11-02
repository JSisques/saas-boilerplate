import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISubscriptionPlanEventData } from '@/shared/domain/events/billing-context/subscription-plan/interfaces/subscription-plan-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class SubscriptionPlanCreatedEvent extends BaseEvent<ISubscriptionPlanEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: ISubscriptionPlanEventData) {
    super(metadata, data);
  }
}
