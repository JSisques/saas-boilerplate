import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventWriteRepository } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { EventPrismaMapper } from '@/event-store-context/event/infrastructure/prisma/mappers/event-prisma.mapper';
import { BasePrismaRepository } from '@/shared/infrastructure/database/prisma/base-prisma.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventPrismaRepository
  extends BasePrismaRepository
  implements EventWriteRepository
{
  constructor(
    prisma: PrismaService,
    private readonly eventPrismaMapper: EventPrismaMapper,
  ) {
    super(prisma);
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

    const EventData = await this.prismaService.event.findUnique({
      where: { id },
    });

    if (!EventData) {
      return null;
    }

    return this.eventPrismaMapper.toDomainEntity(EventData);
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

    const result = await this.prismaService.event.upsert({
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

    await this.prismaService.event.delete({
      where: { id },
    });

    return true;
  }
}
