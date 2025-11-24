import { TenantDatabaseDeletedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-deleted/tenant-database-deleted.event';
import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantDatabaseDeletedEvent)
export class TenantDatabaseDeletedEventHandler
  implements IEventHandler<TenantDatabaseDeletedEvent>
{
  private readonly logger = new Logger(TenantDatabaseDeletedEventHandler.name);

  constructor(
    @Inject(TENANT_DATABASE_READ_REPOSITORY_TOKEN)
    private readonly tenantDatabaseReadRepository: TenantDatabaseReadRepository,
    private readonly assertTenantDatabaseViewModelExsistsService: AssertTenantDatabaseViewModelExsistsService,
  ) {}

  /**
   * Handles the TenantDatabaseDeletedEvent event by removing the existing tenant database view model.
   *
   * @param event - The TenantDatabaseDeletedEvent event to handle.
   */
  async handle(event: TenantDatabaseDeletedEvent) {
    this.logger.log(
      `Handling tenant database deleted event: ${event.aggregateId}`,
    );

    // 01: Assert the tenant database view model exists
    const existingTenantDatabaseViewModel =
      await this.assertTenantDatabaseViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the tenant database view model
    await this.tenantDatabaseReadRepository.delete(
      existingTenantDatabaseViewModel.id,
    );
  }
}
