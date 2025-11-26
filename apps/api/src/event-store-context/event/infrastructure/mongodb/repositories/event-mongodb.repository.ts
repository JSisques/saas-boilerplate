import { EventReadRepository } from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventMongoMapper } from '@/event-store-context/event/infrastructure/mongodb/mappers/event-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventMongoRepository
  extends BaseMongoMasterRepository
  implements EventReadRepository
{
  private readonly collectionName = 'events';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly eventMongoMapper: EventMongoMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(EventMongoRepository.name);
  }

  /**
   * Finds a event by id
   *
   * @param id - The id of the event to find
   * @returns The event if found, null otherwise
   */
  async findById(id: string): Promise<EventViewModel | null> {
    this.logger.log(`Finding event by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const EventViewModel = await collection.findOne({ id });

    return EventViewModel
      ? this.eventMongoMapper.toViewModel({
          id: EventViewModel.id,
          eventType: EventViewModel.eventType,
          aggregateType: EventViewModel.aggregateType,
          aggregateId: EventViewModel.aggregateId,
          payload: EventViewModel.payload,
          timestamp: EventViewModel.timestamp,
          createdAt: EventViewModel.createdAt,
          updatedAt: EventViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds events by criteria
   *
   * @param criteria - The criteria to find events by
   * @returns The events found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<EventViewModel>> {
    this.logger.log(`Finding events by criteria: ${JSON.stringify(criteria)}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const { page, limit, skip } = await this.calculatePagination(criteria);

    // 03: Execute query with pagination
    const [data, total] = await this.executeQueryWithPagination(
      collection,
      mongoQuery,
      sortQuery,
      skip,
      limit,
    );

    // 04: Convert MongoDB documents to domain entities
    const Events = data.map((doc) =>
      this.eventMongoMapper.toViewModel({
        id: doc.id,
        eventType: doc.eventType,
        aggregateType: doc.aggregateType,
        aggregateId: doc.aggregateId,
        payload: doc.payload,
        timestamp: doc.timestamp,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<EventViewModel>(Events, total, page, limit);
  }

  /**
   * Saves a event view model
   *
   * Uses upsert by id to ensure idempotency during replays.
   *
   * @param EventViewModel - The event view model to save
   */
  async save(EventViewModel: EventViewModel): Promise<void> {
    this.logger.log(`Saving event view model with id: ${EventViewModel.id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    const doc = this.eventMongoMapper.toMongoData(EventViewModel);

    await collection.updateOne(
      { id: doc.id },
      {
        $set: {
          eventType: doc.eventType,
          aggregateType: doc.aggregateType,
          aggregateId: doc.aggregateId,
          payload: doc.payload,
          timestamp: doc.timestamp,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          id: doc.id,
          createdAt: doc.createdAt ?? new Date(),
        },
      },
      { upsert: true },
    );
  }

  /**
   * Deletes a event view model by id
   *
   * @param id - The id of the event view model to delete
   * @returns True if the event was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting event view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the event view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
