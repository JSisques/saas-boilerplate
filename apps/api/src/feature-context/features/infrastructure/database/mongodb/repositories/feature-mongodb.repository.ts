import { IFeatureReadRepository } from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { FeatureMongoDBMapper } from '@/feature-context/features/infrastructure/database/mongodb/mappers/feature-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureMongoRepository
  extends BaseMongoMasterRepository
  implements IFeatureReadRepository
{
  private readonly collectionName = 'features';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly featureMongoDBMapper: FeatureMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(FeatureMongoRepository.name);
  }

  /**
   * Finds a feature by id
   *
   * @param id - The id of the feature to find
   * @returns The feature if found, null otherwise
   */
  async findById(id: string): Promise<FeatureViewModel | null> {
    this.logger.log(`Finding feature by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const featureViewModel = await collection.findOne({ id });

    return featureViewModel
      ? this.featureMongoDBMapper.toViewModel({
          id: featureViewModel.id,
          key: featureViewModel.key,
          name: featureViewModel.name,
          description: featureViewModel.description,
          status: featureViewModel.status,
          createdAt: featureViewModel.createdAt,
          updatedAt: featureViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds features by criteria
   *
   * @param criteria - The criteria to find features by
   * @returns The features found
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<FeatureViewModel>> {
    this.logger.log(
      `Finding features by criteria: ${JSON.stringify(criteria)}`,
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
    const features = data.map((doc) =>
      this.featureMongoDBMapper.toViewModel({
        id: doc.id,
        key: doc.key,
        name: doc.name,
        description: doc.description,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<FeatureViewModel>(features, total, page, limit);
  }

  /**
   * Saves a feature view model (upsert operation)
   *
   * @param featureViewModel - The feature view model to save
   */
  async save(featureViewModel: FeatureViewModel): Promise<void> {
    this.logger.log(
      `Saving feature view model with id: ${featureViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.featureMongoDBMapper.toMongoData(featureViewModel);

    // 01: Use upsert to either insert or update the feature view model
    await collection.replaceOne({ id: featureViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a feature view model by id
   *
   * @param id - The id of the feature view model to delete
   * @returns Promise that resolves when the feature is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting feature view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the feature view model from the collection
    await collection.deleteOne({ id });
  }
}
