import { PrismaTenantClientExtended } from '@/shared/infrastructure/database/prisma/clients/custom-prisma-tenant-client/custom-prisma-tenant-client';
import { PrismaTenantFactory } from '@/shared/infrastructure/database/prisma/factories/prisma-tenant-factory/prisma-tenant-factory.service';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/prisma/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class PrismaTenantService {
  private readonly logger = new Logger(PrismaTenantService.name);

  constructor(
    private readonly prismaMasterService: PrismaMasterService,
    private readonly prismaTenantFactory: PrismaTenantFactory,
    private readonly urlBuilder: TenantDatabaseUrlBuilderService,
  ) {}

  /**
   * Get Prisma client for a specific tenant
   * @param tenantId - The tenant ID
   * @returns PrismaClientExtended instance for the tenant
   * @throws NotFoundException if tenant database is not found or not active
   */
  async getTenantClient(tenantId: string): Promise<PrismaTenantClientExtended> {
    // Fetch tenant database configuration from master database
    const tenantDatabase =
      await this.prismaMasterService.client.tenantDatabase.findUnique({
        where: {
          tenantId,
        },
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

    // Build the database URL dynamically (databaseUrl field contains only the database name)
    const databaseUrl = this.urlBuilder.buildDatabaseUrl(
      tenantDatabase.databaseName,
    );

    // Get or create Prisma client for this tenant
    return this.prismaTenantFactory.getTenantClient(tenantId, databaseUrl);
  }

  /**
   * Check if a tenant database exists and is active
   * @param tenantId - The tenant ID
   * @returns true if tenant database exists and is active
   */
  async isTenantDatabaseActive(tenantId: string): Promise<boolean> {
    try {
      const tenantDatabase =
        await this.prismaMasterService.client.tenantDatabase.findUnique({
          where: {
            tenantId,
          },
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
    await this.prismaTenantFactory.removeTenantClient(tenantId);
  }
}
