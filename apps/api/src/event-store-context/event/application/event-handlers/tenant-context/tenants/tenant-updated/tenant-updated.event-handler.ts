import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantUpdatedEvent)
export class TenantUpdatedEventHandler
  implements IEventHandler<TenantUpdatedEvent>
{
  private readonly logger = new Logger(TenantUpdatedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the tenant updated event tracking the event and publishing the event
   *
   * @param event - The tenant updated event
   */
  async handle(event: TenantUpdatedEvent) {
    this.logger.log(`Handling tenant updated event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
