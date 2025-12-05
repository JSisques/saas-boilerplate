import { BaseSaga } from '@/shared/application/sagas/base-saga/base-saga';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { TenantDatabaseProvisioningService } from '@/shared/infrastructure/database/prisma/services/tenant-database-provisioning/tenant-database-provisioning.service';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * SAGA: Tenant Deleted - Cleanup Database
 *
 * This SAGA orchestrates the automatic cleanup of a tenant database
 * when a tenant is deleted. It handles:
 * 1. Removing the tenant database client from cache
 * 2. Dropping the PostgreSQL database
 * 3. Soft deleting the database record
 * 4. Error handling and compensation if needed
 */
@EventsHandler(TenantDeletedEvent)
export class TenantDeletedCleanupDatabaseSaga
  extends BaseSaga
  implements IEventHandler<TenantDeletedEvent>
{
  constructor(
    commandBus: CommandBus,
    private readonly provisioningService: TenantDatabaseProvisioningService,
  ) {
    super(commandBus);
  }

  /**
   * Handles the TenantDeletedEvent by automatically cleaning up the tenant database
   *
   * @param event - The TenantDeletedEvent containing the deleted tenant information
   */
  async handle(event: TenantDeletedEvent): Promise<void> {
    const tenantId = event.aggregateId;

    this.logger.log(
      `🗑️ Starting database cleanup SAGA for tenant: ${tenantId}`,
    );

    // 01: Create and initialize saga instance
    const sagaInstanceId = await this.createSagaInstance(
      `Cleanup Database for Tenant ${tenantId}`,
    );

    try {
      // 02: Step 1 - Delete the tenant database
      await this.executeStep(sagaInstanceId, {
        name: 'Delete Tenant Database',
        order: 1,
        payload: { tenantId },
        action: () => this.deleteDatabaseStep(tenantId),
      });

      // 03: Mark saga as completed
      await this.completeSagaInstance(sagaInstanceId);
      this.logger.log(
        `🎉 Database cleanup SAGA completed successfully for tenant: ${tenantId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Database cleanup SAGA failed for tenant: ${tenantId}. Error: ${error}`,
      );

      // 04: Mark saga as failed
      await this.failSagaInstance(sagaInstanceId);

      // Compensation: If cleanup fails, we could:
      // 1. Mark the tenant database as needing manual intervention
      // 2. Send a notification to administrators
      // 3. Retry the cleanup later
      //
      // For now, we just log the error. The tenant database record
      // will remain in the system, which can be cleaned up manually
      // or via a scheduled job.

      // Note: We don't re-throw the error here because the tenant
      // has already been deleted. The database cleanup failure
      // should not prevent the tenant deletion from completing.
      // However, it should be logged and monitored.
    }
  }

  /**
   * Step 1: Deletes the tenant database
   *
   * This step:
   * - Removes the tenant client from cache
   * - Drops the PostgreSQL database
   * - Soft deletes the database record
   *
   * @param tenantId - The tenant ID
   * @returns Deletion result
   */
  private async deleteDatabaseStep(tenantId: string): Promise<{
    success: boolean;
  }> {
    await this.provisioningService.deleteTenantDatabase(tenantId);

    this.logger.log(`✅ Database deleted successfully for tenant: ${tenantId}`);

    return { success: true };
  }
}
