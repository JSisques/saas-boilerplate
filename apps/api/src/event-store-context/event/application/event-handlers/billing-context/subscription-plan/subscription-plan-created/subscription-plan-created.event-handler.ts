import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionPlanCreatedEvent)
export class SubscriptionPlanCreatedEventHandler
  implements IEventHandler<SubscriptionPlanCreatedEvent>
{
  private readonly logger = new Logger(
    SubscriptionPlanCreatedEventHandler.name,
  );

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the subscription plan created event tracking the event and publishing the event
   *
   * @param event - The subscription plan created event
   */
  async handle(event: SubscriptionPlanCreatedEvent) {
    this.logger.log(
      `Handling subscription plan created event: ${event.aggregateId}`,
    );
    await this.eventTrackingService.execute(event);
  }
}
