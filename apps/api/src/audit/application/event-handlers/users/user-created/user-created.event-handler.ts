import { AuditTrackingService } from '@/audit/application/services/audit-tracking/audit-tracking.service';
import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the user created event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The user created event
   */
  async handle(event: UserCreatedEvent) {
    this.logger.log(`Handling user created event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
