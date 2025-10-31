import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { DomainEventFactory } from '@/event-store-context/event/domain/factories/event-domain.factory';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class EventPublishService implements IBaseService<EventAggregate, void> {
  private readonly logger = new Logger(EventPublishService.name);

  constructor(
    private readonly eventBus: EventBus,
    private readonly domainEventFactory: DomainEventFactory,
  ) {}

  /**
   * Publishes a single event aggregate by converting it to a domain event
   * and publishing it through the event bus.
   *
   * @param {EventAggregate} event - The event aggregate to publish
   * @returns {Promise<void>} Resolves when the event is published
   */
  async execute(event: EventAggregate): Promise<void> {
    this.logger.log(`Publishing event: ${event.eventType.value}`);

    const domainEvent = this.domainEventFactory.create(
      event.eventType.value,
      {
        aggregateId: event.aggregateId.value,
        aggregateType: event.aggregateType.value,
        eventType: event.eventType.value,
        isReplay: true,
      },
      event.payload?.value ?? null,
    );

    await this.eventBus.publish(domainEvent);
  }
}
