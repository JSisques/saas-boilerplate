import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';

@Injectable()
export class GlobalEventTrackingListener
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(GlobalEventTrackingListener.name);
  private subscription?: Subscription;

  constructor(
    private readonly eventBus: EventBus,
    private readonly eventTrackingService: EventTrackingService,
  ) {}

  /**
   * Subscribes to the event bus and tracks events.
   */
  onModuleInit(): void {
    this.logger.log('Subscribing to the event bus');

    this.subscription = this.eventBus.subscribe((event) => {
      if (!(event instanceof BaseEvent)) {
        return;
      }

      if (event instanceof EventCreatedEvent) {
        return;
      }

      if (event.aggregateType === EventAggregate.name) {
        return;
      }

      void this.trackEvent(event);
    });
  }

  /**
   * Unsubscribes from the event bus on module destroy.
   */
  onModuleDestroy(): void {
    this.logger.log('Unsubscribing from the event bus');
    this.subscription?.unsubscribe();
  }

  /**
   * Tracks an event by creating an event entity, saving it to the repository,
   * publishing any uncommitted event events, and marking them as committed.
   *
   * @param event - The domain event to be tracked and stored in the event store.
   * @returns {Promise<void>} Resolves when the event process is complete.
   */
  private async trackEvent(event: BaseEvent<unknown>): Promise<void> {
    try {
      this.logger.log(`Tracking event: ${event.eventType}`);
      await this.eventTrackingService.execute(event);
    } catch (error) {
      const stack = (error as Error)?.stack;
      this.logger.error(
        `Failed to persist event ${event.eventType} for aggregate ${event.aggregateId}`,
        stack,
      );
    }
  }
}
