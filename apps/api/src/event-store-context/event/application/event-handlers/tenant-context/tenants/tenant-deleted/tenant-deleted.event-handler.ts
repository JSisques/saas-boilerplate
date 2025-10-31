import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantDeletedEvent)
export class TenantDeletedEventHandler
  implements IEventHandler<TenantDeletedEvent>
{
  private readonly logger = new Logger(TenantDeletedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the tenant deleted event tracking the event and publishing the event
   *
   * @param event
   */
  async handle(event: TenantDeletedEvent) {
    this.logger.log(`Handling tenant deleted event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
