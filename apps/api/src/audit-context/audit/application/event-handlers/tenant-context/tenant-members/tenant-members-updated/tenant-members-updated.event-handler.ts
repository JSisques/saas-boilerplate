import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberUpdatedEvent)
export class TenantMemberUpdatedEventHandler
  implements IEventHandler<TenantMemberUpdatedEvent>
{
  private readonly logger = new Logger(TenantMemberUpdatedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the tenant member updated event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The tenant member updated event
   */
  async handle(event: TenantMemberUpdatedEvent) {
    this.logger.log(
      `Handling tenant member  updated event: ${event.aggregateId}`,
    );
    await this.auditTrackingService.execute(event);
  }
}
