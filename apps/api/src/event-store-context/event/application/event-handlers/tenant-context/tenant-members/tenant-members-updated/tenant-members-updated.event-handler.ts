import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberUpdatedEvent)
export class TenantMemberUpdatedEventHandler
  implements IEventHandler<TenantMemberUpdatedEvent>
{
  private readonly logger = new Logger(TenantMemberUpdatedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the tenant member updated event tracking the event and publishing the event
   *
   * @param event - The tenant member updated event
   */
  async handle(event: TenantMemberUpdatedEvent) {
    this.logger.log(
      `Handling tenant member  updated event: ${event.aggregateId}`,
    );
    await this.eventTrackingService.execute(event);
  }
}
