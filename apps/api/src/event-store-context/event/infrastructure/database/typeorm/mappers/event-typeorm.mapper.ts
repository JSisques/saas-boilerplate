import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate/event-aggregate.factory';
import { EventTypeormEntity } from '@/event-store-context/event/infrastructure/database/typeorm/entities/event-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventTypeormMapper {
  private readonly logger = new Logger(EventTypeormMapper.name);

  constructor(private readonly eventAggregateFactory: EventAggregateFactory) {}

  /**
   * Converts a TypeORM entity to an event aggregate
   *
   * @param eventEntity - The TypeORM entity to convert
   * @returns The event aggregate
   */
  toDomainEntity(eventEntity: EventTypeormEntity): EventAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${eventEntity.id}`,
    );

    return this.eventAggregateFactory.fromPrimitives({
      id: eventEntity.id,
      eventType: eventEntity.eventType,
      aggregateType: eventEntity.aggregateType,
      aggregateId: eventEntity.aggregateId,
      payload: eventEntity.payload ?? ({} as Record<string, unknown>),
      timestamp: eventEntity.timestamp,
      createdAt: eventEntity.createdAt,
      updatedAt: eventEntity.updatedAt,
    });
  }

  /**
   * Converts an event aggregate to a TypeORM entity
   *
   * @param event - The event aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(event: EventAggregate): EventTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${event.id.value} to TypeORM entity`,
    );

    const primitives = event.toPrimitives();

    const entity = new EventTypeormEntity();

    entity.id = primitives.id;
    entity.eventType = primitives.eventType;
    entity.aggregateType = primitives.aggregateType;
    entity.aggregateId = primitives.aggregateId;
    entity.payload = primitives.payload;
    entity.timestamp = primitives.timestamp;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
