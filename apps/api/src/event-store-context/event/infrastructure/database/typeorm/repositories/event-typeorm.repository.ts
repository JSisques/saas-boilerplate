import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { IEventFilterDto } from '@/event-store-context/event/domain/dtos/filters/event-filter.dto';
import { EventWriteRepository } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { EventTypeormEntity } from '@/event-store-context/event/infrastructure/database/typeorm/entities/event-typeorm.entity';
import { EventTypeormMapper } from '@/event-store-context/event/infrastructure/database/typeorm/mappers/event-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

@Injectable()
export class EventTypeormRepository
  extends BaseTypeormMasterRepository<EventTypeormEntity>
  implements EventWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly eventTypeormMapper: EventTypeormMapper,
  ) {
    super(typeormMasterService, EventTypeormEntity);
    this.logger = new Logger(EventTypeormRepository.name);
  }

  /**
   * Finds an event by their id
   *
   * @param id - The id of the event to find
   * @returns The event if found, null otherwise
   */
  async findById(id: string): Promise<EventAggregate | null> {
    this.logger.log(`Finding event by id: ${id}`);
    const eventEntity = await this.repository.findOne({
      where: { id },
    });

    return eventEntity
      ? this.eventTypeormMapper.toDomainEntity(eventEntity)
      : null;
  }

  /**
   * Finds events by criteria
   *
   * @param filters - The filters to apply
   * @returns The events found
   */
  async findByCriteria(filters: IEventFilterDto): Promise<EventAggregate[]> {
    this.logger.log(`Finding events by criteria: ${JSON.stringify(filters)}`);

    const where: FindOptionsWhere<EventTypeormEntity> = {};

    if (filters.eventType) {
      where.eventType = filters.eventType;
    }

    if (filters.aggregateId) {
      where.aggregateId = filters.aggregateId;
    }

    if (filters.aggregateType) {
      where.aggregateType = filters.aggregateType;
    }

    if (filters.from && filters.to) {
      where.timestamp = Between(filters.from, filters.to);
    } else if (filters.from) {
      where.timestamp = MoreThanOrEqual(filters.from);
    } else if (filters.to) {
      where.timestamp = LessThanOrEqual(filters.to);
    }

    const take = filters.pagination?.perPage;
    const skip = filters.pagination?.page
      ? (filters.pagination.page - 1) * (take || 10)
      : undefined;

    const eventEntities = await this.repository.find({
      where,
      order: {
        timestamp: 'ASC',
      },
      take,
      skip,
    });

    return eventEntities.map((entity) =>
      this.eventTypeormMapper.toDomainEntity(entity),
    );
  }

  /**
   * Saves an event
   *
   * @param event - The event to save
   * @returns The saved event
   */
  async save(event: EventAggregate): Promise<EventAggregate> {
    this.logger.log(`Saving event: ${event.id.value}`);
    const eventEntity = this.eventTypeormMapper.toTypeormEntity(event);

    const savedEntity = await this.repository.save(eventEntity);

    return this.eventTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes an event (soft delete)
   *
   * @param id - The id of the event to delete
   * @returns True if the event was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting event by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
