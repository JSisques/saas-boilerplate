import { PrismaTenantFactory } from '@/shared/infrastructure/database/prisma/factories/prisma-tenant-factory/prisma-tenant-factory.service';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CreateTenantDatabaseParams {
  tenantId: string;
  databaseName?: string;
}

export interface TenantDatabaseInfo {
  id: string;
  tenantId: string;
  databaseName: string;
  databaseUrl: string;
  status: string;
}

@Injectable()
export class TenantDatabaseProvisioningService {
  private readonly logger = new Logger(TenantDatabaseProvisioningService.name);
  private readonly masterDatabaseUrl: string;

  constructor(
    private readonly prismaMasterService: PrismaMasterService,
    private readonly prismaTenantFactory: PrismaTenantFactory,
    private readonly configService: ConfigService,
  ) {
    this.masterDatabaseUrl =
      this.configService.get<string>('DATABASE_URL') || '';
  }

  /**
   * Create a new tenant database
   * @param params - Parameters for creating the tenant database
   * @returns TenantDatabaseInfo with database details
   */
  async createTenantDatabase(
    params: CreateTenantDatabaseParams,
  ): Promise<TenantDatabaseInfo> {
    const { tenantId, databaseName } = params;

    // Validate tenant exists
    const tenant = await this.prismaMasterService.tenant.findUnique({
      where: { id: tenantId, deletedAt: null },
    });

    if (!tenant) {
      throw new BadRequestException(`Tenant not found: ${tenantId}`);
    }

    // Check if tenant database already exists
    const existingDatabase =
      await this.prismaMasterService.tenantDatabase.findUnique({
        where: { tenantId },
      });

    if (existingDatabase && existingDatabase.deletedAt === null) {
      throw new BadRequestException(
        `Tenant database already exists for tenant: ${tenantId}`,
      );
    }

    // Generate database name if not provided
    const finalDatabaseName =
      databaseName || this.generateDatabaseName(tenantId);

    // Generate database URL
    const databaseUrl = this.generateDatabaseUrl(finalDatabaseName);

    try {
      // Create database record in master with PROVISIONING status
      const tenantDatabase =
        await this.prismaMasterService.tenantDatabase.create({
          data: {
            tenantId,
            databaseName: finalDatabaseName,
            databaseUrl,
            status: 'PROVISIONING',
          },
        });

      this.logger.log(
        `Created tenant database record for tenant: ${tenantId}, database: ${finalDatabaseName}`,
      );

      // Create the actual database in PostgreSQL
      await this.createPostgresDatabase(finalDatabaseName);

      // Update status to ACTIVE
      const updatedDatabase =
        await this.prismaMasterService.tenantDatabase.update({
          where: { id: tenantDatabase.id },
          data: {
            status: 'ACTIVE',
          },
        });

      this.logger.log(
        `Tenant database provisioned successfully for tenant: ${tenantId}`,
      );

      return {
        id: updatedDatabase.id,
        tenantId: updatedDatabase.tenantId,
        databaseName: updatedDatabase.databaseName,
        databaseUrl: updatedDatabase.databaseUrl,
        status: updatedDatabase.status,
      };
    } catch (error) {
      this.logger.error(
        `Failed to provision tenant database for tenant ${tenantId}: ${error}`,
      );

      // Update status to FAILED if record exists
      try {
        const failedDatabase =
          await this.prismaMasterService.tenantDatabase.findUnique({
            where: { tenantId },
          });

        if (failedDatabase) {
          await this.prismaMasterService.tenantDatabase.update({
            where: { id: failedDatabase.id },
            data: {
              status: 'FAILED',
              errorMessage:
                error instanceof Error ? error.message : String(error),
            },
          });
        }
      } catch (updateError) {
        this.logger.error(
          `Failed to update tenant database status to FAILED: ${updateError}`,
        );
      }

      throw new InternalServerErrorException(
        `Failed to provision tenant database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Delete a tenant database
   * @param tenantId - The tenant ID
   */
  async deleteTenantDatabase(tenantId: string): Promise<void> {
    const tenantDatabase =
      await this.prismaMasterService.tenantDatabase.findUnique({
        where: { tenantId },
      });

    if (!tenantDatabase) {
      throw new BadRequestException(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    }

    try {
      // Remove tenant client from cache
      await this.prismaTenantFactory.removeTenantClient(tenantId);

      // Drop the actual database
      await this.dropPostgresDatabase(tenantDatabase.databaseName);

      // Soft delete the database record
      await this.prismaMasterService.tenantDatabase.update({
        where: { id: tenantDatabase.id },
        data: {
          deletedAt: new Date(),
        },
      });

      this.logger.log(
        `Tenant database deleted successfully for tenant: ${tenantId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete tenant database for tenant ${tenantId}: ${error}`,
      );
      throw new InternalServerErrorException(
        `Failed to delete tenant database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Update tenant database URL (useful for database migrations or moving tenants)
   * @param tenantId - The tenant ID
   * @param newDatabaseUrl - The new database URL
   */
  async updateTenantDatabaseUrl(
    tenantId: string,
    newDatabaseUrl: string,
  ): Promise<void> {
    const tenantDatabase =
      await this.prismaMasterService.tenantDatabase.findUnique({
        where: { tenantId },
      });

    if (!tenantDatabase) {
      throw new BadRequestException(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    }

    // Remove old client from cache
    await this.prismaTenantFactory.removeTenantClient(tenantId);

    // Update database URL
    await this.prismaMasterService.tenantDatabase.update({
      where: { id: tenantDatabase.id },
      data: {
        databaseUrl: newDatabaseUrl,
      },
    });

    this.logger.log(`Updated database URL for tenant: ${tenantId}`);
  }

  /**
   * Generate database name from tenant ID
   * @param tenantId - The tenant ID
   * @returns Generated database name
   */
  private generateDatabaseName(tenantId: string): string {
    // Remove special characters and create a safe database name
    const safeId = tenantId.replace(/[^a-zA-Z0-9]/g, '_');
    return `tenant_${safeId}`.toLowerCase();
  }

  /**
   * Generate database URL from database name
   * @param databaseName - The database name
   * @returns Database connection URL
   */
  private generateDatabaseUrl(databaseName: string): string {
    // Parse the master database URL and replace the database name
    try {
      const url = new URL(this.masterDatabaseUrl);
      url.pathname = `/${databaseName}`;
      return url.toString();
    } catch (error) {
      // Fallback: simple string replacement
      return this.masterDatabaseUrl.replace(/\/[^\/]+$/, `/${databaseName}`);
    }
  }

  /**
   * Create a PostgreSQL database
   * @param databaseName - The database name to create
   */
  private async createPostgresDatabase(databaseName: string): Promise<void> {
    // Connect to the default 'postgres' database to create the new database
    const postgresUrl = this.getPostgresConnectionUrl();

    const { PrismaClient } = await import('@prisma/client');
    const adminClient = new PrismaClient({
      datasources: {
        db: {
          url: postgresUrl,
        },
      },
    });

    try {
      // Check if database already exists
      const result = await adminClient.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS(
          SELECT FROM pg_database WHERE datname = ${databaseName}
        ) as exists
      `;

      if (result[0]?.exists) {
        this.logger.warn(`Database ${databaseName} already exists`);
        return;
      }

      // Create the database
      await adminClient.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`);

      this.logger.log(`Created PostgreSQL database: ${databaseName}`);
    } finally {
      await adminClient.$disconnect();
    }
  }

  /**
   * Drop a PostgreSQL database
   * @param databaseName - The database name to drop
   */
  private async dropPostgresDatabase(databaseName: string): Promise<void> {
    const postgresUrl = this.getPostgresConnectionUrl();

    const { PrismaClient } = await import('@prisma/client');
    const adminClient = new PrismaClient({
      datasources: {
        db: {
          url: postgresUrl,
        },
      },
    });

    try {
      // Terminate all connections to the database first
      await adminClient.$executeRawUnsafe(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${databaseName}'
        AND pid <> pg_backend_pid()
      `);

      // Drop the database
      await adminClient.$executeRawUnsafe(
        `DROP DATABASE IF EXISTS "${databaseName}"`,
      );

      this.logger.log(`Dropped PostgreSQL database: ${databaseName}`);
    } finally {
      await adminClient.$disconnect();
    }
  }

  /**
   * Get PostgreSQL connection URL for admin operations
   * Uses the master database connection since we need to connect to an existing database
   * to create new ones. The master database is guaranteed to exist.
   * @returns Connection URL to the master database
   */
  private getPostgresConnectionUrl(): string {
    // Use the master database URL directly - it exists and we can use it to create new databases
    return this.masterDatabaseUrl;
  }
}
