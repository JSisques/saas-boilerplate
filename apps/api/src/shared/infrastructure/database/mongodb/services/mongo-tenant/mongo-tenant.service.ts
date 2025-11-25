import { MongoTenantFactory } from '@/shared/infrastructure/database/mongodb/factories/mongo-tenant-factory/mongo-tenant-factory.service';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/mongodb/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class MongoTenantService {
  private readonly logger = new Logger(MongoTenantService.name);

  constructor(
    private readonly mongoMasterService: MongoMasterService,
    private readonly mongoTenantFactory: MongoTenantFactory,
    private readonly urlBuilder: TenantDatabaseUrlBuilderService,
  ) {}

  /**
   * Get MongoDB database instance for a specific tenant
   * @param tenantId - The tenant ID
   * @returns Db instance for the tenant
   * @throws NotFoundException if tenant database is not found or not active
   */
  async getTenantDatabase(tenantId: string): Promise<Db> {
    // Fetch tenant database configuration from master database
    const tenantDatabaseCollection =
      this.mongoMasterService.getCollection('tenant-databases');
    const tenantDatabase = await tenantDatabaseCollection.findOne({
      tenantId,
    });

    if (!tenantDatabase) {
      throw new NotFoundException(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    }

    if (tenantDatabase.status !== 'ACTIVE') {
      throw new NotFoundException(
        `Tenant database is not active for tenant: ${tenantId}. Status: ${tenantDatabase.status}`,
      );
    }

    // Build the database URL dynamically (databaseName field contains the database name)
    const databaseName = tenantDatabase.databaseName;
    const databaseUrl = this.urlBuilder.buildDatabaseUrl(databaseName);

    // Get or create MongoDB client for this tenant
    return this.mongoTenantFactory.getTenantDatabase(
      tenantId,
      databaseUrl,
      databaseName,
    );
  }

  /**
   * Check if a tenant database exists and is active
   * @param tenantId - The tenant ID
   * @returns true if tenant database exists and is active
   */
  async isTenantDatabaseActive(tenantId: string): Promise<boolean> {
    try {
      const tenantDatabaseCollection =
        this.mongoMasterService.getCollection('tenant-databases');
      const tenantDatabase = await tenantDatabaseCollection.findOne({
        tenantId,
      });

      return tenantDatabase?.status === 'ACTIVE';
    } catch (error) {
      this.logger.error(
        `Error checking tenant database status for ${tenantId}: ${error}`,
      );
      return false;
    }
  }

  /**
   * Remove tenant client from cache (useful when database URL changes)
   * @param tenantId - The tenant ID
   */
  async invalidateTenantClient(tenantId: string): Promise<void> {
    await this.mongoTenantFactory.removeTenantClient(tenantId);
  }
}
