import { TenantDatabaseViewModelFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-view-model/tenant-database-view-model.factory';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseMongoDbDto } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/dtos/tenant-database-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantDatabaseMongoDBMapper {
  private readonly logger = new Logger(TenantDatabaseMongoDBMapper.name);

  constructor(
    private readonly tenantDatabaseViewModelFactory: TenantDatabaseViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a tenant database view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The tenant database view model
   */
  public toViewModel(doc: TenantDatabaseMongoDbDto): TenantDatabaseViewModel {
    this.logger.log(
      `Converting MongoDB document to tenant database view model with id ${doc.id}`,
    );

    return this.tenantDatabaseViewModelFactory.create({
      id: doc.id,
      tenantId: doc.tenantId,
      databaseName: doc.databaseName,
      databaseUrl: doc.databaseUrl,
      status: doc.status,
      schemaVersion: doc.schemaVersion,
      lastMigrationAt: doc.lastMigrationAt,
      errorMessage: doc.errorMessage,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a tenant database view model to a MongoDB document
   *
   * @param tenantDatabaseViewModel - The tenant database view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(
    tenantDatabaseViewModel: TenantDatabaseViewModel,
  ): TenantDatabaseMongoDbDto {
    this.logger.log(
      `Converting tenant database view model with id ${tenantDatabaseViewModel.id} to MongoDB document`,
    );

    return {
      id: tenantDatabaseViewModel.id,
      tenantId: tenantDatabaseViewModel.tenantId,
      databaseName: tenantDatabaseViewModel.databaseName,
      databaseUrl: tenantDatabaseViewModel.databaseUrl,
      status: tenantDatabaseViewModel.status,
      schemaVersion: tenantDatabaseViewModel.schemaVersion,
      lastMigrationAt: tenantDatabaseViewModel.lastMigrationAt,
      errorMessage: tenantDatabaseViewModel.errorMessage,
      createdAt: tenantDatabaseViewModel.createdAt,
      updatedAt: tenantDatabaseViewModel.updatedAt,
    };
  }
}
