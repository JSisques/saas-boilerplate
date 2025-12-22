import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/prisma/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { TypeormTenantFactory } from '@/shared/infrastructure/database/typeorm/factories/typeorm-tenant-factory/typeorm-tenant-factory.service';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantDatabaseCreateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-create/tenant-database-create.command';
import { TenantDatabaseDeleteCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import { FindTenantDatabaseByIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-id/tenant-database-find-by-id.query';
import { FindTenantDatabaseByTenantIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-member-find-by-tenant-id/tenant-database-find-by-tenant-id.query';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { FindTenantByIdQuery } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

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
export class TenantDatabaseProvisioningTypeormService {
  private readonly logger = new Logger(
    TenantDatabaseProvisioningTypeormService.name,
  );
  private readonly masterDatabaseUrl: string;

  constructor(
    private readonly typeormMasterService: TypeormMasterService,
    private readonly typeormTenantFactory: TypeormTenantFactory,
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly urlBuilder: TenantDatabaseUrlBuilderService,
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

    // 01: Validate tenant exists
    await this.queryBus.execute(
      new FindTenantByIdQuery({
        id: tenantId,
      }),
    );

    // 02: Check if tenant database already exists
    const existingDatabase = await this.queryBus.execute(
      new FindTenantDatabaseByTenantIdQuery({
        tenantId,
      }),
    );

    if (existingDatabase) {
      throw new BadRequestException(
        `Tenant database already exists for tenant: ${tenantId}`,
      );
    }

    // 03: Generate database name if not provided
    const finalDatabaseName =
      databaseName || this.generateDatabaseName(tenantId);

    try {
      // 05: Create database record in master with PROVISIONING status using command
      const tenantDatabaseId = await this.commandBus.execute(
        new TenantDatabaseCreateCommand({
          tenantId,
          databaseName: finalDatabaseName,
        }),
      );

      this.logger.log(
        `Created tenant database record for tenant: ${tenantId}, database: ${finalDatabaseName}, id: ${tenantDatabaseId}`,
      );

      // 06: Create the actual database in PostgreSQL
      await this.createPostgresDatabase(finalDatabaseName);

      // 07: Update status to ACTIVE using command
      await this.commandBus.execute(
        new TenantDatabaseUpdateCommand({
          id: tenantDatabaseId,
          status: TenantDatabaseStatusEnum.ACTIVE,
        }),
      );

      // 08: Get the updated database info for return
      const updatedDatabase = await this.queryBus.execute(
        new FindTenantDatabaseByIdQuery({
          id: tenantDatabaseId,
        }),
      );

      this.logger.log(
        `Tenant database provisioned successfully for tenant: ${tenantId}`,
      );

      // 09: Build the actual database URL for return (but we store only the name)
      const actualDatabaseUrl = this.urlBuilder.buildDatabaseUrl(
        updatedDatabase.databaseName.value,
      );

      return {
        id: updatedDatabase.id.value,
        tenantId: updatedDatabase.tenantId.value,
        databaseName: updatedDatabase.databaseName.value,
        databaseUrl: actualDatabaseUrl,
        status: updatedDatabase.status.value,
      };
    } catch (error) {
      this.logger.error(
        `Failed to provision tenant database for tenant ${tenantId}: ${error}`,
      );

      // 10: Update status to FAILED if record exists using command
      try {
        const failedDatabase = await this.queryBus.execute(
          new FindTenantDatabaseByTenantIdQuery({
            tenantId,
          }),
        );

        if (!failedDatabase) {
          throw new InternalServerErrorException(
            `Failed to find tenant database for tenant ${tenantId}`,
          );
        }

        await this.commandBus.execute(
          new TenantDatabaseUpdateCommand({
            id: failedDatabase.id.value,
            status: TenantDatabaseStatusEnum.FAILED,
            errorMessage:
              error instanceof Error ? error.message : String(error),
          }),
        );
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
    const tenantDatabase = await this.queryBus.execute(
      new FindTenantDatabaseByTenantIdQuery({
        tenantId,
      }),
    );

    // If no database exists for this tenant, nothing to delete
    if (!tenantDatabase) {
      this.logger.warn(
        `No tenant database found for tenant: ${tenantId}. Skipping deletion.`,
      );
      return;
    }

    try {
      // 01: Remove tenant DataSource from cache
      await this.typeormTenantFactory.removeTenantDataSource(tenantId);

      // 02: Drop the actual database
      await this.dropPostgresDatabase(tenantDatabase.databaseName.value);

      // 03: Soft delete the database record
      await this.commandBus.execute(
        new TenantDatabaseDeleteCommand({
          id: tenantDatabase.id.value,
        }),
      );

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
   * Update tenant database name (useful for database migrations or moving tenants)
   * Note: We only store the database name, not the full URL with credentials
   * @param tenantId - The tenant ID
   * @param newDatabaseName - The new database name
   */
  async updateTenantDatabaseName(
    tenantId: string,
    newDatabaseName: string,
  ): Promise<void> {
    const tenantDatabase = await this.queryBus.execute(
      new FindTenantDatabaseByTenantIdQuery({
        tenantId,
      }),
    );

    if (!tenantDatabase) {
      throw new BadRequestException(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    }

    // 01: Remove old DataSource from cache
    await this.typeormTenantFactory.removeTenantDataSource(tenantId);

    // 02: Update database name using command (we only store the name, not the full URL)
    await this.commandBus.execute(
      new TenantDatabaseUpdateCommand({
        id: tenantDatabase.id.value,
        databaseName: newDatabaseName,
      }),
    );

    this.logger.log(`Updated database name for tenant: ${tenantId}`);
  }

  /**
   * Generate database name from tenant ID
   * @param tenantId - The tenant ID
   * @returns Generated database name
   */
  private generateDatabaseName(tenantId: string): string {
    // 01: Remove special characters and create a safe database name
    const safeId = tenantId.replace(/[^a-zA-Z0-9]/g, '_');
    return `tenant_${safeId}`.toLowerCase();
  }

  /**
   * Create a PostgreSQL database using TypeORM DataSource
   * @param databaseName - The database name to create
   */
  private async createPostgresDatabase(databaseName: string): Promise<void> {
    // 01: Connect to the default 'postgres' database to create the new database
    const postgresUrl = this.getPostgresConnectionUrl();

    const adminDataSource = new DataSource({
      type: 'postgres',
      url: postgresUrl,
    });

    try {
      await adminDataSource.initialize();

      // 02: Check if database already exists
      const result = await adminDataSource.query<Array<{ exists: boolean }>>(
        `SELECT EXISTS(
          SELECT FROM pg_database WHERE datname = $1
        ) as exists`,
        [databaseName],
      );

      if (result[0]?.exists) {
        this.logger.warn(`Database ${databaseName} already exists`);
        return;
      }

      // 03: Create the database
      await adminDataSource.query(`CREATE DATABASE "${databaseName}"`);

      this.logger.log(`Created PostgreSQL database: ${databaseName}`);
    } finally {
      if (adminDataSource.isInitialized) {
        await adminDataSource.destroy();
      }
    }
  }

  /**
   * Drop a PostgreSQL database using TypeORM DataSource
   * @param databaseName - The database name to drop
   */
  private async dropPostgresDatabase(databaseName: string): Promise<void> {
    const postgresUrl = this.getPostgresConnectionUrl();

    const adminDataSource = new DataSource({
      type: 'postgres',
      url: postgresUrl,
    });

    try {
      await adminDataSource.initialize();

      // 02: Terminate all connections to the database first
      await adminDataSource.query(
        `
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid()
      `,
        [databaseName],
      );

      // 03: Drop the database
      await adminDataSource.query(`DROP DATABASE IF EXISTS "${databaseName}"`);

      this.logger.log(`Dropped PostgreSQL database: ${databaseName}`);
    } finally {
      if (adminDataSource.isInitialized) {
        await adminDataSource.destroy();
      }
    }
  }

  /**
   * Get PostgreSQL connection URL for admin operations
   * Uses the master database connection since we need to connect to an existing database
   * to create new ones. The master database is guaranteed to exist.
   * @returns Connection URL to the master database
   */
  private getPostgresConnectionUrl(): string {
    return this.masterDatabaseUrl;
  }
}
