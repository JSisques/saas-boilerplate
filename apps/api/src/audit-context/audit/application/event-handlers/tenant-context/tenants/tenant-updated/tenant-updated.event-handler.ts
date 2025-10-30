import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantUpdatedEvent)
export class TenantUpdatedEventHandler
  implements IEventHandler<TenantUpdatedEvent>
{
  private readonly logger = new Logger(TenantUpdatedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the tenant updated event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The tenant updated event
   */
  async handle(event: TenantUpdatedEvent) {
    this.logger.log(`Handling tenant updated event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
