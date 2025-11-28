import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { IEventFilterDto } from '@/event-store-context/event/domain/dtos/filters/event-filter.dto';
import { EventWriteRepository } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { EventPrismaMapper } from '@/event-store-context/event/infrastructure/prisma/mappers/event-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventPrismaRepository
  extends BasePrismaMasterRepository
  implements EventWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly eventPrismaMapper: EventPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(EventPrismaRepository.name);
  }

  /**
   * Finds a event by their id
   *
   * @param id - The id of the event to find
   * @returns The event if found, null otherwise
   */
  async findById(id: string): Promise<EventAggregate | null> {
    this.logger.log(`Finding event by id: ${id}`);

    const EventData = await this.prismaMasterService.client.event.findUnique({
      where: { id },
    });

    if (!EventData) {
      return null;
    }

    return this.eventPrismaMapper.toDomainEntity(EventData);
  }

  async findByCriteria(filters: IEventFilterDto): Promise<EventAggregate[]> {
    this.logger.log(`Finding events by criteria: ${JSON.stringify(filters)}`);

    const events = await this.prismaMasterService.client.event.findMany({
      where: {
        eventType: filters.eventType,
        aggregateId: filters.aggregateId,
        aggregateType: filters.aggregateType,
        timestamp: {
          gte: filters.from,
          lte: filters.to,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      take: filters.pagination?.perPage,
      skip: filters.pagination?.page,
    });

    return events.map((event) => this.eventPrismaMapper.toDomainEntity(event));
  }

  /**
   * Saves a event
   *
   * @param event - The event to save
   * @returns The saved event
   */
  async save(event: EventAggregate): Promise<EventAggregate> {
    this.logger.log(`Saving event: ${JSON.stringify(event)}`);

    const eventData = this.eventPrismaMapper.toPrismaData(event);

    const result = await this.prismaMasterService.client.event.upsert({
      where: { id: event.id.value },
      update: eventData,
      create: eventData,
    });

    return this.eventPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a user
   *
   * @param event - The event to delete
   * @returns True if the event was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting event by id: ${id}`);

    await this.prismaMasterService.client.event.delete({
      where: { id },
    });

    return true;
  }
}
