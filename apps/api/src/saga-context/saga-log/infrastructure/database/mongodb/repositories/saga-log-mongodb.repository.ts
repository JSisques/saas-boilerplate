import { SagaLogReadRepository } from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogMongoDBMapper } from '@/saga-context/saga-log/infrastructure/database/mongodb/mappers/saga-log-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogMongoRepository
  extends BaseMongoMasterRepository
  implements SagaLogReadRepository
{
  private readonly collectionName = 'saga-logs';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly sagaLogMongoDBMapper: SagaLogMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(SagaLogMongoRepository.name);
  }

  /**
   * Finds a saga log by id
   *
   * @param id - The id of the saga log to find
   * @returns The saga log if found, null otherwise
   */
  async findById(id: string): Promise<SagaLogViewModel | null> {
    this.logger.log(`Finding saga log by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const sagaLogViewModel = await collection.findOne({ id });

    return sagaLogViewModel
      ? this.sagaLogMongoDBMapper.toViewModel({
          id: sagaLogViewModel.id,
          sagaInstanceId: sagaLogViewModel.sagaInstanceId,
          sagaStepId: sagaLogViewModel.sagaStepId,
          type: sagaLogViewModel.type,
          message: sagaLogViewModel.message,
          createdAt: new Date(sagaLogViewModel.createdAt),
          updatedAt: new Date(sagaLogViewModel.updatedAt),
        })
      : null;
  }

  /**
   * Finds saga logs by saga instance id
   *
   * @param sagaInstanceId - The saga instance id of the saga logs to find
   * @returns The saga logs if found, empty array otherwise
   */
  async findBySagaInstanceId(
    sagaInstanceId: string,
  ): Promise<SagaLogViewModel[]> {
    this.logger.log(`Finding saga logs by saga instance id: ${sagaInstanceId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const sagaLogsData = await collection.find({ sagaInstanceId }).toArray();

    return sagaLogsData.map((doc) =>
      this.sagaLogMongoDBMapper.toViewModel({
        id: doc.id,
        sagaInstanceId: doc.sagaInstanceId,
        sagaStepId: doc.sagaStepId,
        type: doc.type,
        message: doc.message,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }),
    );
  }

  /**
   * Finds saga logs by saga step id
   *
   * @param sagaStepId - The saga step id of the saga logs to find
   * @returns The saga logs if found, empty array otherwise
   */
  async findBySagaStepId(sagaStepId: string): Promise<SagaLogViewModel[]> {
    this.logger.log(`Finding saga logs by saga step id: ${sagaStepId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const sagaLogsData = await collection.find({ sagaStepId }).toArray();

    return sagaLogsData.map((doc) =>
      this.sagaLogMongoDBMapper.toViewModel({
        id: doc.id,
        sagaInstanceId: doc.sagaInstanceId,
        sagaStepId: doc.sagaStepId,
        type: doc.type,
        message: doc.message,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }),
    );
  }

  /**
   * Finds saga logs by criteria
   *
   * @param criteria - The criteria to find saga logs by
   * @returns The saga logs found
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SagaLogViewModel>> {
    this.logger.log(
      `Finding saga logs by criteria: ${JSON.stringify(criteria)}`,
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
    const sagaLogs = data.map((doc) =>
      this.sagaLogMongoDBMapper.toViewModel({
        id: doc.id,
        sagaInstanceId: doc.sagaInstanceId,
        sagaStepId: doc.sagaStepId,
        type: doc.type,
        message: doc.message,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }),
    );

    return new PaginatedResult<SagaLogViewModel>(sagaLogs, total, page, limit);
  }

  /**
   * Saves a saga log view model (upsert operation)
   *
   * @param sagaLogViewModel - The saga log view model to save
   */
  async save(sagaLogViewModel: SagaLogViewModel): Promise<void> {
    this.logger.log(
      `Saving saga log view model with id: ${sagaLogViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.sagaLogMongoDBMapper.toMongoData(sagaLogViewModel);

    // 01: Use upsert to either insert or update the saga log view model
    await collection.replaceOne({ id: sagaLogViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a saga log view model by id
   *
   * @param id - The id of the saga log view model to delete
   * @returns True if the saga log view model was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting saga log view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the saga log view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
