import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Injectable, Scope } from '@nestjs/common';
import { Collection } from 'mongodb';

/**
 * Base repository for MongoDB collections that require tenant isolation.
 * Automatically filters all queries by tenantId to ensure data isolation.
 *
 * This class extends BaseMongoMasterRepository and adds automatic tenant filtering
 * to all find, save, and delete operations.
 *
 * @example
 * ```typescript
 * @Injectable({ scope: Scope.REQUEST })
 * export class MyRepository extends BaseMongoTenantRepository {
 *   constructor(
 *     mongoMasterService: MongoMasterService,
 *     tenantContextService: TenantContextService,
 *   ) {
 *     super(mongoMasterService, tenantContextService);
 *   }
 * }
 * ```
 */
@Injectable({ scope: Scope.REQUEST })
export abstract class BaseMongoTenantRepository extends BaseMongoMasterRepository {
  constructor(
    mongoMasterService: MongoMasterService,
    protected readonly tenantContextService: TenantContextService,
  ) {
    super(mongoMasterService);
  }

  /**
   * Get the current tenant ID from the tenant context service.
   * @throws {Error} Throws if tenant ID is not found.
   */
  protected get tenantId(): string {
    return this.tenantContextService.getTenantIdOrThrow();
  }

  /**
   * Automatically adds tenantId to MongoDB query
   */
  protected addTenantFilter(query: any): any {
    return {
      ...query,
      tenantId: this.tenantId,
    };
  }

  /**
   * Get collection with automatic tenant filtering support
   */
  protected getCollection(collectionName: string): Collection {
    return this.mongoMasterService.getCollection(collectionName);
  }

  /**
   * Builds a MongoDB query from criteria with automatic tenant filtering
   *
   * @param criteria - The criteria to build the query from
   * @returns The MongoDB query with tenantId filter
   */
  protected buildMongoQueryWithTenant(criteria: any): any {
    const query = this.buildMongoQuery(criteria);
    return this.addTenantFilter(query);
  }

  /**
   * Finds a document by id with automatic tenant filtering
   *
   * @param collection - The MongoDB collection
   * @param id - The id of the document to find
   * @returns The document if found, null otherwise
   */
  protected async findOneById(
    collection: Collection,
    id: string,
  ): Promise<any | null> {
    return collection.findOne(this.addTenantFilter({ id }));
  }

  /**
   * Saves a document with automatic tenantId setting
   *
   * @param collection - The MongoDB collection
   * @param id - The id of the document
   * @param mongoData - The document data (will have tenantId added automatically)
   * @returns Promise that resolves when the document is saved
   */
  protected async saveWithTenant(
    collection: Collection,
    id: string,
    mongoData: any,
  ): Promise<void> {
    const dataWithTenant = {
      ...mongoData,
      tenantId: this.tenantId,
    };

    await collection.replaceOne(this.addTenantFilter({ id }), dataWithTenant, {
      upsert: true,
    });
  }

  /**
   * Deletes a document by id with automatic tenant filtering
   *
   * @param collection - The MongoDB collection
   * @param id - The id of the document to delete
   * @returns Promise that resolves when the document is deleted
   */
  protected async deleteById(
    collection: Collection,
    id: string,
  ): Promise<void> {
    await collection.deleteOne(this.addTenantFilter({ id }));
  }
}
