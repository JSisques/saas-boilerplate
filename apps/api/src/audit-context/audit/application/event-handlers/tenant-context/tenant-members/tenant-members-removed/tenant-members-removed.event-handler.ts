import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberRemovedEvent)
export class TenantMemberRemovedEventHandler
  implements IEventHandler<TenantMemberRemovedEvent>
{
  private readonly logger = new Logger(TenantMemberRemovedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the tenant member removed event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The tenant member removed event
   */
  async handle(event: TenantMemberRemovedEvent) {
    this.logger.log(
      `Handling tenant member removed event: ${event.aggregateId}`,
    );
    await this.auditTrackingService.execute(event);
  }
}
