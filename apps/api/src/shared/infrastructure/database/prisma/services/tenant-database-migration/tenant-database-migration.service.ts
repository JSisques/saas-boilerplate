import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant/prisma-tenant.service';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TenantDatabaseStatusEnum } from '@prisma/client';
import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface MigrationResult {
  tenantId: string;
  success: boolean;
  migrationVersion?: string;
  error?: string;
}

@Injectable()
export class TenantDatabaseMigrationService {
  private readonly logger = new Logger(TenantDatabaseMigrationService.name);

  constructor(
    private readonly prismaMasterService: PrismaMasterService,
    private readonly prismaTenantService: PrismaTenantService,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Run migrations for a specific tenant
   * @param tenantId - The tenant ID
   * @returns MigrationResult with migration status
   */
  async migrateTenantDatabase(tenantId: string): Promise<MigrationResult> {
    const tenantDatabase =
      await this.prismaMasterService.tenantDatabase.findUnique({
        where: { tenantId },
      });

    if (!tenantDatabase) {
      throw new NotFoundException(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    }

    if (tenantDatabase.status !== 'ACTIVE') {
      throw new InternalServerErrorException(
        `Tenant database is not active. Status: ${tenantDatabase.status}`,
      );
    }

    try {
      // Update status to MIGRATING using command
      await this.commandBus.execute(
        new TenantDatabaseUpdateCommand({
          id: tenantDatabase.id,
          status: TenantDatabaseStatusEnum.MIGRATING,
        }),
      );

      // Run Prisma migrations
      const migrationVersion = await this.runPrismaMigrations(
        tenantDatabase.databaseUrl,
      );

      // Update status back to ACTIVE and record migration info using command
      await this.commandBus.execute(
        new TenantDatabaseUpdateCommand({
          id: tenantDatabase.id,
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: migrationVersion,
          lastMigrationAt: new Date(),
        }),
      );

      // Invalidate tenant client to force reconnection with new schema
      await this.prismaTenantService.invalidateTenantClient(tenantId);

      this.logger.log(
        `Migrations completed successfully for tenant: ${tenantId}`,
      );

      return {
        tenantId,
        success: true,
        migrationVersion,
      };
    } catch (error) {
      this.logger.error(`Migration failed for tenant ${tenantId}: ${error}`);

      // Update status to FAILED using command
      await this.commandBus
        .execute(
          new TenantDatabaseUpdateCommand({
            id: tenantDatabase.id,
            status: TenantDatabaseStatusEnum.FAILED,
            errorMessage:
              error instanceof Error ? error.message : String(error),
          }),
        )
        .catch((updateError) => {
          // Log error but don't throw - we're already in error handling
          this.logger.error(
            `Failed to update tenant database status to FAILED: ${updateError}`,
          );
        });

      return {
        tenantId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Run migrations for all active tenants
   * @returns Array of MigrationResult for each tenant
   */
  async migrateAllTenantDatabases(): Promise<MigrationResult[]> {
    const tenantDatabases =
      await this.prismaMasterService.tenantDatabase.findMany({
        where: {
          status: TenantDatabaseStatusEnum.ACTIVE,
          deletedAt: null,
        },
      });

    this.logger.log(
      `Starting migrations for ${tenantDatabases.length} tenant databases`,
    );

    const results: MigrationResult[] = [];

    for (const tenantDatabase of tenantDatabases) {
      try {
        const result = await this.migrateTenantDatabase(
          tenantDatabase.tenantId,
        );
        results.push(result);
      } catch (error) {
        this.logger.error(
          `Failed to migrate tenant ${tenantDatabase.tenantId}: ${error}`,
        );
        results.push({
          tenantId: tenantDatabase.tenantId,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    this.logger.log(
      `Migrations completed: ${successCount}/${results.length} successful`,
    );

    return results;
  }

  /**
   * Run Prisma migrations for a specific database
   * @param databaseUrl - The database connection URL
   * @returns Migration version/identifier
   */
  private async runPrismaMigrations(databaseUrl: string): Promise<string> {
    const tenantSchemaPath = join(
      process.cwd(),
      'prisma',
      'tenant',
      'schema.prisma',
    );

    try {
      // Set DATABASE_URL environment variable for this migration
      const env = {
        ...process.env,
        DATABASE_URL: databaseUrl,
      };

      // Run Prisma migrate deploy (for production) or migrate dev (for development)
      const { stdout, stderr } = await execAsync(
        `npx prisma migrate deploy --schema=${tenantSchemaPath}`,
        {
          env,
          cwd: process.cwd(),
        },
      );

      if (stderr && !stderr.includes('warning')) {
        this.logger.warn(`Migration warnings: ${stderr}`);
      }

      // Extract migration version from output or use timestamp
      const migrationVersion = new Date().toISOString();

      this.logger.log(`Migrations applied successfully: ${stdout}`);

      return migrationVersion;
    } catch (error) {
      this.logger.error(`Failed to run Prisma migrations: ${error}`);
      throw new InternalServerErrorException(
        `Migration execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get migration status for a tenant
   * @param tenantId - The tenant ID
   * @returns Migration status information
   */
  async getTenantMigrationStatus(tenantId: string) {
    const tenantDatabase =
      await this.prismaMasterService.tenantDatabase.findUnique({
        where: { tenantId },
      });

    if (!tenantDatabase) {
      throw new NotFoundException(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    }

    return {
      tenantId: tenantDatabase.tenantId,
      status: tenantDatabase.status,
      schemaVersion: tenantDatabase.schemaVersion,
      lastMigrationAt: tenantDatabase.lastMigrationAt,
      errorMessage: tenantDatabase.errorMessage,
    };
  }
}
