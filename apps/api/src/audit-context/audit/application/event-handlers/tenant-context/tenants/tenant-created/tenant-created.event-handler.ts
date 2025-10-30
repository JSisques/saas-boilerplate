import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantCreatedEvent)
export class TenantCreatedEventHandler
  implements IEventHandler<TenantCreatedEvent>
{
  private readonly logger = new Logger(TenantCreatedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the tenant created event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The tenant created event
   */
  async handle(event: TenantCreatedEvent) {
    this.logger.log(`Handling tenant created event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
