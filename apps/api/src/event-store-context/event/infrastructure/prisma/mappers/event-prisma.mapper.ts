import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate/event-aggregate.factory';
import { EventPrismaDto } from '@/event-store-context/event/infrastructure/prisma/dtos/event-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventPrismaMapper {
  private readonly logger = new Logger(EventPrismaMapper.name);

  constructor(private readonly eventAggregateFactory: EventAggregateFactory) {}

  /**
   * Converts a Prisma data to a event aggregate
   *
   * @param EventData - The Prisma data to convert
   * @returns The event aggregate
   */
  toDomainEntity(EventData: EventPrismaDto): EventAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${EventData.id}`,
    );

    return this.eventAggregateFactory.fromPrimitives({
      id: EventData.id,
      eventType: EventData.eventType,
      aggregateType: EventData.aggregateType,
      aggregateId: EventData.aggregateId,
      payload: EventData.payload,
      timestamp: EventData.timestamp,
    });
  }

  /**
   * Converts a domain entity to a Prisma data
   *
   * @param event - The domain entity to convert
   * @returns The Prisma data
   */
  toPrismaData(event: EventAggregate): EventPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${event.id.value} to Prisma data`,
    );

    return {
      id: event.id.value,
      eventType: event.eventType.value,
      aggregateType: event.aggregateType.value,
      aggregateId: event.aggregateId.value,
      payload: event.payload?.value ?? null,
      timestamp: event.timestamp.value,
    };
  }
}
