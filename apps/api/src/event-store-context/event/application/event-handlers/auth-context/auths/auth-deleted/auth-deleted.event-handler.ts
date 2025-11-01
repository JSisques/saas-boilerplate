import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { AuthDeletedEvent } from '@/shared/domain/events/auth/auth-deleted/auth-deleted.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthDeletedEvent)
export class AuthDeletedEventHandler
  implements IEventHandler<AuthDeletedEvent>
{
  private readonly logger = new Logger(AuthDeletedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the auth deleted event tracking the event and publishing the event
   *
   * @param event
   */
  async handle(event: AuthDeletedEvent) {
    this.logger.log(`Handling auth deleted event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
