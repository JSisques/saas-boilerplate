import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantDeletedEvent)
export class TenantDeletedEventHandler
  implements IEventHandler<TenantDeletedEvent>
{
  private readonly logger = new Logger(TenantDeletedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the tenant deleted event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event
   */
  async handle(event: TenantDeletedEvent) {
    this.logger.log(`Handling tenant deleted event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
