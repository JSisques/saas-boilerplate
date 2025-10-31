import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler
  implements IEventHandler<UserDeletedEvent>
{
  private readonly logger = new Logger(UserDeletedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the user deleted event tracking the event and publishing the event
   *
   * @param event
   */
  async handle(event: UserDeletedEvent) {
    this.logger.log(`Handling user deleted event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
