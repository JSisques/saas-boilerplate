import { BaseSaga } from '@/shared/application/sagas/base-saga/base-saga';
import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantDatabaseMigrationTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-migration/tenant-database-migration-typeorm.service';
import { TenantDatabaseProvisioningTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-provisioning/tenant-database-provisioning-typeorm.service';
import { TenantMigrationFailedException } from '@/tenant-context/tenants/application/exceptions/tenant-migration-failed/tenant-migration-failed.exception';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

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
  extends BaseSaga
  implements IEventHandler<TenantCreatedEvent>
{
  constructor(
    commandBus: CommandBus,
    private readonly provisioningService: TenantDatabaseProvisioningTypeormService,
    private readonly migrationService: TenantDatabaseMigrationTypeormService,
  ) {
    super(commandBus);
  }

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

    // 01: Create and initialize saga instance
    const sagaInstanceId = await this.createSagaInstance(
      `Provision Database for Tenant ${tenantId}`,
    );

    try {
      // 02: Step 1 - Provision the tenant database
      await this.executeStep(sagaInstanceId, {
        name: 'Provision Database',
        order: 1,
        payload: { tenantId },
        action: () => this.provisionDatabaseStep(tenantId),
      });

      // 03: Step 2 - Run initial migrations
      await this.executeStep(sagaInstanceId, {
        name: 'Run Initial Migrations',
        order: 2,
        payload: { tenantId },
        action: () => this.runMigrationsStep(tenantId),
      });

      // 04: Mark saga as completed
      await this.completeSagaInstance(sagaInstanceId);
      this.logger.log(`🎉 SAGA completed successfully for tenant: ${tenantId}`);
    } catch (error) {
      this.logger.error(
        `❌ SAGA failed for tenant: ${tenantId}. Error: ${error}`,
      );

      // 05: Mark saga as failed
      await this.failSagaInstance(sagaInstanceId);

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

  /**
   * Step 1: Provisions the tenant database
   *
   * @param tenantId - The tenant ID
   * @returns Database information
   */
  private async provisionDatabaseStep(tenantId: string): Promise<{
    databaseInfo: unknown;
  }> {
    const databaseInfo = await this.provisioningService.createTenantDatabase({
      tenantId,
    });

    this.logger.log(
      `✅ Database provisioned successfully for tenant: ${tenantId}`,
    );
    this.logger.debug(`Database details: ${JSON.stringify(databaseInfo)}`);

    return { databaseInfo };
  }

  /**
   * Step 2: Runs initial migrations for the tenant database
   *
   * @param tenantId - The tenant ID
   * @returns Migration result
   */
  private async runMigrationsStep(tenantId: string): Promise<{
    success: boolean;
  }> {
    const migrationResult =
      await this.migrationService.migrateTenantDatabase(tenantId);

    if (!migrationResult.success) {
      throw new TenantMigrationFailedException(
        migrationResult.error || 'Unknown error',
      );
    }

    this.logger.log(
      `✅ Migrations completed successfully for tenant: ${tenantId}`,
    );

    return { success: true };
  }
}
