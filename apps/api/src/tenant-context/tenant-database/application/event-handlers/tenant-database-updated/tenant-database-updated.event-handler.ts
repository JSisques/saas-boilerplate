import { TenantDatabaseUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-updated/tenant-database-updated.event';
import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantDatabaseUpdatedEvent)
export class TenantDatabaseUpdatedEventHandler
  implements IEventHandler<TenantDatabaseUpdatedEvent>
{
  private readonly logger = new Logger(TenantDatabaseUpdatedEventHandler.name);

  constructor(
    @Inject(TENANT_DATABASE_READ_REPOSITORY_TOKEN)
    private readonly tenantDatabaseReadRepository: TenantDatabaseReadRepository,
    private readonly assertTenantDatabaseViewModelExsistsService: AssertTenantDatabaseViewModelExsistsService,
  ) {}

  /**
   * Handles the TenantDatabaseUpdatedEvent event by updating the existing tenant database view model.
   *
   * @param event - The TenantDatabaseUpdatedEvent event to handle.
   */
  async handle(event: TenantDatabaseUpdatedEvent) {
    this.logger.log(
      `Handling tenant database updated event: ${event.aggregateId}`,
    );

    // 01: Assert the tenant database view model exists
    const existingTenantDatabaseViewModel =
      await this.assertTenantDatabaseViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingTenantDatabaseViewModel.update(event.data);

    // 03: Save the updated tenant database view model
    await this.tenantDatabaseReadRepository.save(
      existingTenantDatabaseViewModel,
    );
  }
}
