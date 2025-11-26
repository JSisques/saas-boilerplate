import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantDatabaseReadRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseMongoDBMapper } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/mappers/tenant-database-mongodb.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantDatabaseMongoRepository
  extends BaseMongoMasterRepository
  implements TenantDatabaseReadRepository
{
  private readonly collectionName = 'tenant-databases';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly tenantDatabaseMongoDBMapper: TenantDatabaseMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(TenantDatabaseMongoRepository.name);
  }

  /**
   * Finds a tenant database by id
   *
   * @param id - The id of the tenant database to find
   * @returns The tenant database if found, null otherwise
   */
  async findById(id: string): Promise<TenantDatabaseViewModel | null> {
    this.logger.log(`Finding tenant database by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const tenantDatabaseViewModel = await collection.findOne({ id });

    return tenantDatabaseViewModel
      ? this.tenantDatabaseMongoDBMapper.toViewModel({
          id: tenantDatabaseViewModel.id,
          tenantId: tenantDatabaseViewModel.tenantId,
          databaseName: tenantDatabaseViewModel.databaseName,
          readDatabaseName: tenantDatabaseViewModel.readDatabaseName,
          status: tenantDatabaseViewModel.status,
          schemaVersion: tenantDatabaseViewModel.schemaVersion,
          lastMigrationAt: tenantDatabaseViewModel.lastMigrationAt,
          errorMessage: tenantDatabaseViewModel.errorMessage,
          createdAt: tenantDatabaseViewModel.createdAt,
          updatedAt: tenantDatabaseViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds tenant databases by tenant id
   *
   * @param tenantId - The id of the tenant to find tenant databases by
   * @returns The tenant databases found
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<TenantDatabaseViewModel[] | null> {
    this.logger.log(`Finding tenant databases by tenant id: ${tenantId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const tenantDatabases = await collection.find({ tenantId }).toArray();

    return tenantDatabases.map((doc) =>
      this.tenantDatabaseMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        databaseName: doc.databaseName,
        readDatabaseName: doc.readDatabaseName,
        status: doc.status,
        schemaVersion: doc.schemaVersion,
        lastMigrationAt: doc.lastMigrationAt,
        errorMessage: doc.errorMessage,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }
  /**
   * Finds tenant databases by user id
   *
   * @param userId - The id of the user to find tenant databases by
   * @returns The tenant databases found
   */
  async findByUserId(
    userId: string,
  ): Promise<TenantDatabaseViewModel[] | null> {
    this.logger.log(`Finding tenant databases by user id: ${userId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const tenantDatabases = await collection.find({ userId }).toArray();

    return tenantDatabases.map((doc) =>
      this.tenantDatabaseMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        databaseName: doc.databaseName,
        readDatabaseName: doc.readDatabaseName,
        status: doc.status,
        schemaVersion: doc.schemaVersion,
        lastMigrationAt: doc.lastMigrationAt,
        errorMessage: doc.errorMessage,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  /**
   * Finds tenant databases by criteria
   *
   * @param criteria - The criteria to find tenant databases by
   * @returns The tenant databases found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<TenantDatabaseViewModel>> {
    this.logger.log(
      `Finding tenant databases by criteria: ${JSON.stringify(criteria)}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

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
    const tenantDatabases = data.map((doc) =>
      this.tenantDatabaseMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        databaseName: doc.databaseName,
        readDatabaseName: doc.readDatabaseName,
        status: doc.status,
        schemaVersion: doc.schemaVersion,
        lastMigrationAt: doc.lastMigrationAt,
        errorMessage: doc.errorMessage,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<TenantDatabaseViewModel>(
      tenantDatabases,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a tenant database view model (upsert operation)
   *
   * @param tenantDatabaseViewModel - The tenant database view model to save
   */
  async save(tenantDatabaseViewModel: TenantDatabaseViewModel): Promise<void> {
    this.logger.log(
      `Saving tenant database view model with id: ${tenantDatabaseViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.tenantDatabaseMongoDBMapper.toMongoData(
      tenantDatabaseViewModel,
    );

    // 01: Use upsert to either insert or update the tenant database view model
    await collection.replaceOne({ id: tenantDatabaseViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a tenant database view model by id
   *
   * @param id - The id of the tenant database view model to delete
   * @returns True if the tenant database was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting tenant database view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the tenant database view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
