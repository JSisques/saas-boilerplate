import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthUpdatedEvent)
export class AuthUpdatedEventHandler
  implements IEventHandler<AuthUpdatedEvent>
{
  private readonly logger = new Logger(AuthUpdatedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the auth updated event tracking the event and publishing the event
   *
   * @param event - The auth updated event
   */
  async handle(event: AuthUpdatedEvent) {
    this.logger.log(`Handling auth updated event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
