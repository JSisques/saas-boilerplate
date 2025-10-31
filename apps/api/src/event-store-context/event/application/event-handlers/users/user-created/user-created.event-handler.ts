import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the user created tracking the event and publishing the event
   *
   * @param event - The user created event
   */
  async handle(event: UserCreatedEvent) {
    this.logger.log(`Handling user created event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
