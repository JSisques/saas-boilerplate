import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoTenantRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-tenant/base-mongo-tenant.repository';
import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { StorageReadRepository } from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageMongoDBMapper } from '@/storage-context/storage/infrastructure/database/mongodb/mappers/storage-mongodb.mapper';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class StorageMongoRepository
  extends BaseMongoTenantRepository
  implements StorageReadRepository
{
  protected readonly tenantId: string;

  private readonly collectionName = 'storages';

  constructor(
    mongoTenantService: MongoTenantService,
    private readonly storageMongoDBMapper: StorageMongoDBMapper,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(mongoTenantService);
    this.logger = new Logger(StorageMongoRepository.name);

    // Get tenantId from request headers or user context
    // You can customize this based on how you pass tenantId in your requests
    this.tenantId =
      (this.request.headers['x-tenant-id'] as string) ||
      (this.request.user as any)?.tenantId ||
      (this.request.body?.tenantId as string) ||
      (this.request.query?.tenantId as string);

    if (!this.tenantId) {
      throw new Error('Tenant ID is required but not found in request');
    }
  }

  /**
   * Finds a storage by id
   *
   * @param id - The id of the storage to find
   * @returns The storage if found, null otherwise
   */
  async findById(id: string): Promise<StorageViewModel | null> {
    this.logger.log(`Finding storage by id: ${id}`);

    const database = await this.getTenantDatabase();
    const storageViewModel = await database
      .collection(this.collectionName)
      .findOne({ id });

    return storageViewModel
      ? this.storageMongoDBMapper.toViewModel({
          id: storageViewModel.id,
          fileName: storageViewModel.fileName,
          fileSize: storageViewModel.fileSize,
          mimeType: storageViewModel.mimeType,
          provider: storageViewModel.provider,
          url: storageViewModel.url,
          path: storageViewModel.path,
          createdAt: storageViewModel.createdAt,
          updatedAt: storageViewModel.updatedAt,
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

    const database = await this.getTenantDatabase();
    const collection = database.collection(this.collectionName);

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const page = criteria.pagination.page || 1;
    const limit = criteria.pagination.perPage || 10;
    const skip = (page - 1) * limit;

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
    const storages = data.map((doc) =>
      this.storageMongoDBMapper.toViewModel({
        id: doc.id,
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

    const database = await this.getTenantDatabase();
    const collection = database.collection(this.collectionName);
    const mongoData = this.storageMongoDBMapper.toMongoData(storageViewModel);

    // 01: Use upsert to either insert or update the storage view model
    await collection.replaceOne({ id: storageViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a storage view model by id
   *
   * @param id - The id of the storage view model to delete
   * @returns True if the storage was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting storage view model by id: ${id}`);

    const database = await this.getTenantDatabase();
    const collection = database.collection(this.collectionName);

    // 01: Delete the storage view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
