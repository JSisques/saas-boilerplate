import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { AuthCreatedEvent } from '@/shared/domain/events/auth/auth-created/auth-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthCreatedEvent)
export class AuthCreatedEventHandler
  implements IEventHandler<AuthCreatedEvent>
{
  private readonly logger = new Logger(AuthCreatedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the auth created tracking event and publishing the event
   *
   * @param event - The auth created event
   */
  async handle(event: AuthCreatedEvent) {
    this.logger.log(`Handling auth created event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
