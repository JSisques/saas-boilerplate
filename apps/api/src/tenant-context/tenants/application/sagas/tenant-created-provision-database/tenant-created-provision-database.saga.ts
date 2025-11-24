import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantDatabaseMigrationService } from '@/shared/infrastructure/database/prisma/services/tenant-database-migration/tenant-database-migration.service';
import { TenantDatabaseProvisioningService } from '@/shared/infrastructure/database/prisma/services/tenant-database-provisioning/tenant-database-provisioning.service';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * SAGA: Tenant Created - Provision Database
 *
 * This SAGA orchestrates the automatic provisioning of a tenant database
 * when a new tenant is created. It handles:
 * 1. Creating the tenant database
 * 2. Running initial migrations
 * 3. Error handling and compensation if needed
 */
@EventsHandler(TenantCreatedEvent)
export class TenantCreatedProvisionDatabaseSaga
  implements IEventHandler<TenantCreatedEvent>
{
  private readonly logger = new Logger(TenantCreatedProvisionDatabaseSaga.name);

  constructor(
    private readonly provisioningService: TenantDatabaseProvisioningService,
    private readonly migrationService: TenantDatabaseMigrationService,
  ) {}

  /**
   * Handles the TenantCreatedEvent by automatically provisioning the tenant database
   *
   * @param event - The TenantCreatedEvent containing the new tenant information
   */
  async handle(event: TenantCreatedEvent): Promise<void> {
    const tenantId = event.aggregateId;

    this.logger.log(
      `🚀 Starting database provisioning SAGA for tenant: ${tenantId}`,
    );

    try {
      // Step 1: Provision the tenant database
      this.logger.log(
        `📦 Step 1: Provisioning database for tenant: ${tenantId}`,
      );
      const databaseInfo = await this.provisioningService.createTenantDatabase({
        tenantId,
      });

      this.logger.log(
        `✅ Database provisioned successfully for tenant: ${tenantId}`,
      );
      this.logger.debug(`Database details: ${JSON.stringify(databaseInfo)}`);

      // Step 2: Run initial migrations
      this.logger.log(
        `🔄 Step 2: Running initial migrations for tenant: ${tenantId}`,
      );
      const migrationResult =
        await this.migrationService.migrateTenantDatabase(tenantId);

      if (migrationResult.success) {
        this.logger.log(
          `✅ Migrations completed successfully for tenant: ${tenantId}`,
        );
        this.logger.log(
          `🎉 SAGA completed successfully for tenant: ${tenantId}`,
        );
      } else {
        this.logger.error(
          `❌ Migration failed for tenant: ${tenantId}. Error: ${migrationResult.error}`,
        );
        // Note: The database is already created, but migrations failed
        // In a production system, you might want to:
        // - Mark the tenant as needing attention
        // - Send an alert
        // - Or rollback the database creation
      }
    } catch (error) {
      this.logger.error(
        `❌ SAGA failed for tenant: ${tenantId}. Error: ${error}`,
      );

      // Compensation: If provisioning fails, we could:
      // 1. Mark the tenant as needing manual intervention
      // 2. Send a notification to administrators
      // 3. Retry the provisioning later
      //
      // For now, we just log the error. The tenant database record
      // will remain in PROVISIONING or FAILED status, which can be
      // retried manually or via a scheduled job.

      // Re-throw to allow other error handlers to process if needed
      // In production, you might want to handle this differently
      throw error;
    }
  }
}
