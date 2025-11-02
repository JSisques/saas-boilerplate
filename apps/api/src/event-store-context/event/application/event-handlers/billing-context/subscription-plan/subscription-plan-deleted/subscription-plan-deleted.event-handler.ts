import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionPlanDeletedEvent)
export class SubscriptionPlanDeletedEventHandler
  implements IEventHandler<SubscriptionPlanDeletedEvent>
{
  private readonly logger = new Logger(
    SubscriptionPlanDeletedEventHandler.name,
  );

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the subscription plan deleted event tracking the event and publishing the event
   *
   * @param event - The subscription plan deleted event
   */
  async handle(event: SubscriptionPlanDeletedEvent) {
    this.logger.log(
      `Handling subscription plan deleted event: ${event.aggregateId}`,
    );
    await this.eventTrackingService.execute(event);
  }
}
