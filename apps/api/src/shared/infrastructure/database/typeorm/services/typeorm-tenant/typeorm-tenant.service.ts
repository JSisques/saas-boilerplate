import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TypeormTenantFactory } from '@/shared/infrastructure/database/typeorm/factories/typeorm-tenant-factory/typeorm-tenant-factory.service';
import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { TenantDatabaseTypeormEntity } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/entities/tenant-database-typeorm.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeormTenantService {
  private readonly logger = new Logger(TypeormTenantService.name);

  constructor(
    private readonly typeormMasterService: TypeormMasterService,
    private readonly typeormTenantFactory: TypeormTenantFactory,
    private readonly urlBuilder: TenantDatabaseUrlBuilderService,
  ) {}

  /**
   * Get TypeORM DataSource for a specific tenant
   * @param tenantId - The tenant ID
   * @returns DataSource instance for the tenant
   * @throws NotFoundException if tenant database is not found or not active
   */
  async getTenantDataSource(tenantId: string): Promise<DataSource> {
    // Fetch tenant database configuration from master database
    const tenantDatabaseRepository = this.typeormMasterService.getRepository(
      TenantDatabaseTypeormEntity,
    );

    const tenantDatabase = await tenantDatabaseRepository.findOne({
      where: { tenantId },
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

    // Build the database URL dynamically (databaseName field contains only the database name)
    const databaseUrl = this.urlBuilder.buildDatabaseUrl(
      tenantDatabase.databaseName,
    );

    // Get or create TypeORM DataSource for this tenant
    return this.typeormTenantFactory.getTenantDataSource(tenantId, databaseUrl);
  }

  /**
   * Check if a tenant database exists and is active
   * @param tenantId - The tenant ID
   * @returns true if tenant database exists and is active
   */
  async isTenantDatabaseActive(tenantId: string): Promise<boolean> {
    try {
      const tenantDatabaseRepository = this.typeormMasterService.getRepository(
        TenantDatabaseTypeormEntity,
      );

      const tenantDatabase = await tenantDatabaseRepository.findOne({
        where: { tenantId },
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
   * Remove tenant DataSource from cache (useful when database URL changes)
   * @param tenantId - The tenant ID
   */
  async invalidateTenantDataSource(tenantId: string): Promise<void> {
    await this.typeormTenantFactory.removeTenantDataSource(tenantId);
  }
}
