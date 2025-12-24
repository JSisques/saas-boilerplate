import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoTenantRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-tenant/base-mongo-tenant.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageReadRepository } from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageMongoDBMapper } from '@/storage-context/storage/infrastructure/database/mongodb/mappers/storage-mongodb.mapper';
import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class StorageMongoRepository
  extends BaseMongoTenantRepository
  implements StorageReadRepository
{
  private readonly collectionName = 'storages';

  constructor(
    mongoMasterService: MongoMasterService,
    tenantContextService: TenantContextService,
    private readonly storageMongoDBMapper: StorageMongoDBMapper,
  ) {
    super(mongoMasterService, tenantContextService);
    this.logger = new Logger(StorageMongoRepository.name);
  }

  /**
   * Finds a storage by id
   *
   * @param id - The id of the storage to find
   * @returns The storage if found, null otherwise
   */
  async findById(id: string): Promise<StorageViewModel | null> {
    this.logger.log(`Finding storage by id: ${id}`);

    const collection = this.getCollection(this.collectionName);
    const doc = await this.findOneById(collection, id);

    return doc
      ? this.storageMongoDBMapper.toViewModel({
          id: doc.id,
          tenantId: doc.tenantId,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          provider: doc.provider,
          url: doc.url,
          path: doc.path,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })
      : null;
  }

  /**
   * Finds storages by criteria
   *
   * @param criteria - The criteria to find storages by
   * @returns The storages found
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<StorageViewModel>> {
    this.logger.log(
      `Finding storages by criteria: ${JSON.stringify(criteria)}`,
    );

    const collection = this.getCollection(this.collectionName);

    // 01: Build MongoDB query from criteria with tenant filter
    const mongoQuery = this.buildMongoQueryWithTenant(criteria);
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

    // 04: Convert MongoDB documents to view models
    const storages = data.map((doc) =>
      this.storageMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        provider: doc.provider,
        url: doc.url,
        path: doc.path,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<StorageViewModel>(storages, total, page, limit);
  }

  /**
   * Saves a storage view model (upsert operation)
   *
   * @param storageViewModel - The storage view model to save
   */
  async save(storageViewModel: StorageViewModel): Promise<void> {
    this.logger.log(
      `Saving storage view model with id: ${storageViewModel.id}`,
    );

    const collection = this.getCollection(this.collectionName);
    const mongoData = this.storageMongoDBMapper.toMongoData(storageViewModel);

    // 02: Use upsert to either insert or update the storage view model with tenantId
    await this.saveWithTenant(collection, storageViewModel.id, mongoData);
  }

  /**
   * Deletes a storage view model by id
   *
   * @param id - The id of the storage view model to delete
   * @returns True if the storage was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting storage view model by id: ${id}`);

    const collection = this.getCollection(this.collectionName);

    // 01: Delete the storage view model from the collection with tenant filter
    await this.deleteById(collection, id);

    return true;
  }
}
