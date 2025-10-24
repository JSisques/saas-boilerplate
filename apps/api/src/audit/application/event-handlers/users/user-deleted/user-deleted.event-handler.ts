import { AuditTrackingService } from '@/audit/application/services/audit-tracking/audit-tracking.service';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler
  implements IEventHandler<UserDeletedEvent>
{
  private readonly logger = new Logger(UserDeletedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the user deleted event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event
   */
  async handle(event: UserDeletedEvent) {
    this.logger.log(`Handling user deleted event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
