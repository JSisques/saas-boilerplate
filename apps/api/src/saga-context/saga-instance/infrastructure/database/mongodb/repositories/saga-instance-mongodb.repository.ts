import { SagaInstanceReadRepository } from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceMongoDBMapper } from '@/saga-context/saga-instance/infrastructure/database/mongodb/mappers/saga-instance-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstanceMongoRepository
  extends BaseMongoMasterRepository
  implements SagaInstanceReadRepository
{
  private readonly collectionName = 'saga-instances';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly sagaInstanceMongoDBMapper: SagaInstanceMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(SagaInstanceMongoRepository.name);
  }

  /**
   * Finds a saga instance by id
   *
   * @param id - The id of the saga instance to find
   * @returns The saga instance if found, null otherwise
   */
  async findById(id: string): Promise<SagaInstanceViewModel | null> {
    this.logger.log(`Finding saga instance by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const sagaInstanceViewModel = await collection.findOne({ id });

    return sagaInstanceViewModel
      ? this.sagaInstanceMongoDBMapper.toViewModel({
          id: sagaInstanceViewModel.id,
          name: sagaInstanceViewModel.name,
          status: sagaInstanceViewModel.status,
          startDate: sagaInstanceViewModel.startDate,
          endDate: sagaInstanceViewModel.endDate,
          createdAt: new Date(sagaInstanceViewModel.createdAt),
          updatedAt: new Date(sagaInstanceViewModel.updatedAt),
        })
      : null;
  }

  /**
   * Finds saga instances by criteria
   *
   * @param criteria - The criteria to find saga instances by
   * @returns The saga instances found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SagaInstanceViewModel>> {
    this.logger.log(
      `Finding saga instances by criteria: ${JSON.stringify(criteria)}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const { page, limit, skip } = await this.calculatePagination(criteria);

    // 03: Execute query with pagination
    const [data, total] = await Promise.all([
      collection
        .find(mongoQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(mongoQuery),
    ]);

    // 04: Convert MongoDB documents to domain entities
    const sagaInstances = data.map((doc) =>
      this.sagaInstanceMongoDBMapper.toViewModel({
        id: doc.id,
        name: doc.name,
        status: doc.status,
        startDate: doc.startDate,
        endDate: doc.endDate,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }),
    );

    return new PaginatedResult<SagaInstanceViewModel>(
      sagaInstances,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a saga instance view model (upsert operation)
   *
   * @param sagaInstanceViewModel - The saga instance view model to save
   */
  async save(sagaInstanceViewModel: SagaInstanceViewModel): Promise<void> {
    this.logger.log(
      `Saving saga instance view model with id: ${sagaInstanceViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.sagaInstanceMongoDBMapper.toMongoData(
      sagaInstanceViewModel,
    );

    // 01: Use upsert to either insert or update the saga instance view model
    await collection.replaceOne({ id: sagaInstanceViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a saga instance view model by id
   *
   * @param id - The id of the saga instance view model to delete
   * @returns True if the saga instance view model was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting saga instance view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the saga instance view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
