import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberRemovedEvent)
export class TenantMemberRemovedEventHandler
  implements IEventHandler<TenantMemberRemovedEvent>
{
  private readonly logger = new Logger(TenantMemberRemovedEventHandler.name);

  constructor(private readonly eventTrackingService: EventTrackingService) {}

  /**
   * Handles the tenant member removed event tracking the event and publishing the event
   *
   * @param event - The tenant member removed event
   */
  async handle(event: TenantMemberRemovedEvent) {
    this.logger.log(
      `Handling tenant member removed event: ${event.aggregateId}`,
    );
    await this.eventTrackingService.execute(event);
  }
}
