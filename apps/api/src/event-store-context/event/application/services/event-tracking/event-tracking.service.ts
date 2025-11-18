import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate.factory';
import {
  EVENT_WRITE_REPOSITORY_TOKEN,
  EventWriteRepository,
} from '@/event-store-context/event/domain/repositories/event-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class EventTrackingService
  implements IBaseService<BaseEvent<any>, void>
{
  private readonly logger = new Logger(EventTrackingService.name);

  constructor(
    @Inject(EVENT_WRITE_REPOSITORY_TOKEN)
    private readonly eventWriteRepository: EventWriteRepository,
    private readonly eventAggregateFactory: EventAggregateFactory,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Tracks an event by creating an event entity, saving it to the repository,
   * publishing any uncommitted event events, and marking them as committed.
   *
   * @param {BaseEvent<any>} event - The domain event to be tracked and stored in the event store.
   * @returns {Promise<void>} Resolves when the event process is complete.
   *
   * The flow of this method is:
   * 1. Create an event entity from the received event.
   * 2. Save the event entity to the corresponding repository.
   * 3. Publish all uncommitted event store events.
   * 4. Mark the event events as committed.
   */
  async execute(event: BaseEvent<any>): Promise<void> {
    if (event.isReplay) {
      this.logger.debug(
        `Skipping tracking for replayed event: ${event.eventType} (${event.aggregateId})`,
      );
      return;
    }

    this.logger.log(`Tracking event event: ${event.eventType}`);

    // 01: Create the event entity
    const newEvent = this.eventAggregateFactory.fromPrimitives({
      id: UuidValueObject.generate().value,
      eventType: event.eventType,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.data,
      timestamp: event.ocurredAt,
    });

    // 02: Save the event entity
    await this.eventWriteRepository.save(newEvent);

    // 03: Publish the event events
    await this.eventBus.publishAll(newEvent.getUncommittedEvents());

    // 04: Mark the event events as committed
    newEvent.commit();
  }
}
