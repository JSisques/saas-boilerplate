import { AuditTrackingService } from '@/audit/application/services/audit-tracking/audit-tracking.service';
import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler
  implements IEventHandler<UserUpdatedEvent>
{
  private readonly logger = new Logger(UserUpdatedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the user updated event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The user updated event
   */
  async handle(event: UserUpdatedEvent) {
    this.logger.log(`Handling user updated event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
