import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberAddedEvent)
export class TenantMemberAddedEventHandler
  implements IEventHandler<TenantMemberAddedEvent>
{
  private readonly logger = new Logger(TenantMemberAddedEventHandler.name);

  constructor(private readonly auditTrackingService: AuditTrackingService) {}

  /**
   * Handles the tenant member added event creating an audit entity, saving it to the database and publishing the event
   *
   * @param event - The tenant member added event
   */
  async handle(event: TenantMemberAddedEvent) {
    this.logger.log(`Handling tenant member added event: ${event.aggregateId}`);
    await this.auditTrackingService.execute(event);
  }
}
