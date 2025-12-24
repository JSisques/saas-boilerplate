import { SagaStepReadRepository } from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepMongoDBMapper } from '@/saga-context/saga-step/infrastructure/database/mongodb/mappers/saga-step-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepMongoRepository
  extends BaseMongoMasterRepository
  implements SagaStepReadRepository
{
  private readonly collectionName = 'saga-steps';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly sagaStepMongoDBMapper: SagaStepMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(SagaStepMongoRepository.name);
  }

  /**
   * Finds a saga step by id
   *
   * @param id - The id of the saga step to find
   * @returns The saga step if found, null otherwise
   */
  async findById(id: string): Promise<SagaStepViewModel | null> {
    this.logger.log(`Finding saga step by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const sagaStepViewModel = await collection.findOne({ id });

    return sagaStepViewModel
      ? this.sagaStepMongoDBMapper.toViewModel({
          id: sagaStepViewModel.id,
          sagaInstanceId: sagaStepViewModel.sagaInstanceId,
          name: sagaStepViewModel.name,
          order: sagaStepViewModel.order,
          status: sagaStepViewModel.status,
          startDate: sagaStepViewModel.startDate,
          endDate: sagaStepViewModel.endDate,
          errorMessage: sagaStepViewModel.errorMessage,
          retryCount: sagaStepViewModel.retryCount,
          maxRetries: sagaStepViewModel.maxRetries,
          payload: sagaStepViewModel.payload,
          result: sagaStepViewModel.result,
          createdAt: new Date(sagaStepViewModel.createdAt),
          updatedAt: new Date(sagaStepViewModel.updatedAt),
        })
      : null;
  }

  /**
   * Finds saga steps by saga instance id
   *
   * @param sagaInstanceId - The saga instance id of the saga steps to find
   * @returns The saga steps if found, empty array otherwise
   */
  async findBySagaInstanceId(
    sagaInstanceId: string,
  ): Promise<SagaStepViewModel[]> {
    this.logger.log(
      `Finding saga steps by saga instance id: ${sagaInstanceId}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const sagaStepsData = await collection.find({ sagaInstanceId }).toArray();

    return sagaStepsData.map((doc) =>
      this.sagaStepMongoDBMapper.toViewModel({
        id: doc.id,
        sagaInstanceId: doc.sagaInstanceId,
        name: doc.name,
        order: doc.order,
        status: doc.status,
        startDate: doc.startDate,
        endDate: doc.endDate,
        errorMessage: doc.errorMessage,
        retryCount: doc.retryCount,
        maxRetries: doc.maxRetries,
        payload: doc.payload,
        result: doc.result,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }),
    );
  }

  /**
   * Finds saga steps by criteria
   *
   * @param criteria - The criteria to find saga steps by
   * @returns The saga steps found
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SagaStepViewModel>> {
    this.logger.log(
      `Finding saga steps by criteria: ${JSON.stringify(criteria)}`,
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
    const sagaSteps = data.map((doc) =>
      this.sagaStepMongoDBMapper.toViewModel({
        id: doc.id,
        sagaInstanceId: doc.sagaInstanceId,
        name: doc.name,
        order: doc.order,
        status: doc.status,
        startDate: doc.startDate,
        endDate: doc.endDate,
        errorMessage: doc.errorMessage,
        retryCount: doc.retryCount,
        maxRetries: doc.maxRetries,
        payload: doc.payload,
        result: doc.result,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }),
    );

    return new PaginatedResult<SagaStepViewModel>(
      sagaSteps,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a saga step view model (upsert operation)
   *
   * @param sagaStepViewModel - The saga step view model to save
   */
  async save(sagaStepViewModel: SagaStepViewModel): Promise<void> {
    this.logger.log(
      `Saving saga step view model with id: ${sagaStepViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.sagaStepMongoDBMapper.toMongoData(sagaStepViewModel);

    // 01: Use upsert to either insert or update the saga step view model
    await collection.replaceOne({ id: sagaStepViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a saga step view model by id
   *
   * @param id - The id of the saga step view model to delete
   * @returns True if the saga step view model was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting saga step view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the saga step view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
