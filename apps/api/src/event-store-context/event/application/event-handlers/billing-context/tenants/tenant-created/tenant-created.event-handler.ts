import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantCreatedEvent)
export class TenantCreatedEventHandler
  implements IEventHandler<TenantCreatedEvent>
{
  private readonly logger = new Logger(TenantCreatedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the tenant created tracking event and publishing the event
   *
   * @param event - The tenant created event
   */
  async handle(event: TenantCreatedEvent) {
    this.logger.log(`Handling tenant created event: ${event.aggregateId}`);
    await this.eventTrackingService.execute(event);
  }
}
