import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { AuthUpdatedLastLoginAtEvent } from '@/shared/domain/events/auth/auth-updated-last-login-at/auth-updated-last-login-at.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthUpdatedLastLoginAtEvent)
export class AuthUpdatedLastLoginAtEventHandler
  implements IEventHandler<AuthUpdatedLastLoginAtEvent>
{
  private readonly logger = new Logger(AuthUpdatedLastLoginAtEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the auth updated last login at event tracking event and publishing the event
   *
   * @param event - The auth updated last login at event
   */
  async handle(event: AuthUpdatedLastLoginAtEvent) {
    this.logger.log(
      `Handling auth updated last login at event: ${event.aggregateId}`,
    );
    await this.eventTrackingService.execute(event);
  }
}
