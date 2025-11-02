import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { SubscriptionPlanUpdatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionPlanUpdatedEvent)
export class SubscriptionPlanUpdatedEventHandler
  implements IEventHandler<SubscriptionPlanUpdatedEvent>
{
  private readonly logger = new Logger(
    SubscriptionPlanUpdatedEventHandler.name,
  );

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the subscription plan updated event tracking the event and publishing the event
   *
   * @param event - The subscription plan updated event
   */
  async handle(event: SubscriptionPlanUpdatedEvent) {
    this.logger.log(
      `Handling subscription plan updated event: ${event.aggregateId}`,
    );
    await this.eventTrackingService.execute(event);
  }
}
