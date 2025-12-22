import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/prisma/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseTypeormEntity } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/entities/tenant-database-typeorm.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

export interface MigrationResult {
  tenantId: string;
  success: boolean;
  migrationVersion?: string;
  error?: string;
}

@Injectable()
export class TenantDatabaseMigrationTypeormService {
  private readonly logger = new Logger(
    TenantDatabaseMigrationTypeormService.name,
  );

  constructor(
    private readonly typeormMasterService: TypeormMasterService,
    private readonly typeormTenantService: TypeormTenantService,
    private readonly commandBus: CommandBus,
    private readonly urlBuilder: TenantDatabaseUrlBuilderService,
  ) {}

  /**
   * Run migrations for a specific tenant
   * @param tenantId - The tenant ID
   * @returns MigrationResult with migration status
   */
  async migrateTenantDatabase(tenantId: string): Promise<MigrationResult> {
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

      // Run TypeORM migrations
      const migrationVersion = await this.runTypeormMigrations(tenantId);

      // Update status back to ACTIVE and record migration info using command
      await this.commandBus.execute(
        new TenantDatabaseUpdateCommand({
          id: tenantDatabase.id,
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: migrationVersion,
          lastMigrationAt: new Date(),
        }),
      );

      // Invalidate tenant DataSource to force reconnection with new schema
      await this.typeormTenantService.invalidateTenantDataSource(tenantId);

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
    const tenantDatabaseRepository = this.typeormMasterService.getRepository(
      TenantDatabaseTypeormEntity,
    );

    const tenantDatabases = await tenantDatabaseRepository.find({
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
   * Run TypeORM migrations for a specific database
   * @param tenantId - The tenant ID
   * @returns Migration version/identifier
   */
  private async runTypeormMigrations(tenantId: string): Promise<string> {
    try {
      // Get or create DataSource for the tenant
      const dataSource =
        await this.typeormTenantService.getTenantDataSource(tenantId);

      // Run pending migrations
      const migrations = await dataSource.runMigrations();

      if (migrations.length === 0) {
        this.logger.log(`No pending migrations for tenant: ${tenantId}`);
        return 'no-migrations';
      }

      // Get the latest migration name as version
      const latestMigration = migrations[migrations.length - 1];
      const migrationVersion = latestMigration.name || new Date().toISOString();

      this.logger.log(
        `Applied ${migrations.length} migration(s) for tenant: ${tenantId}. Latest: ${migrationVersion}`,
      );

      return migrationVersion;
    } catch (error) {
      this.logger.error(`Failed to run TypeORM migrations: ${error}`);
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

    return {
      tenantId: tenantDatabase.tenantId,
      status: tenantDatabase.status,
      schemaVersion: tenantDatabase.schemaVersion,
      lastMigrationAt: tenantDatabase.lastMigrationAt,
      errorMessage: tenantDatabase.errorMessage,
    };
  }
}
