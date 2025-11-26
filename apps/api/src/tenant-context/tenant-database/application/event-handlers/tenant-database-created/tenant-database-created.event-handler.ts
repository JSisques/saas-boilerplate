import { TenantDatabaseCreatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-created/tenant-database-created.event';
import { TenantDatabaseViewModelFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-view-model/tenant-database-view-model.factory';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantDatabaseCreatedEvent)
export class TenantDatabaseCreatedEventHandler
  implements IEventHandler<TenantDatabaseCreatedEvent>
{
  private readonly logger = new Logger(TenantDatabaseCreatedEventHandler.name);

  constructor(
    @Inject(TENANT_DATABASE_READ_REPOSITORY_TOKEN)
    private readonly tenantDatabaseReadRepository: TenantDatabaseReadRepository,
    private readonly tenantDatabaseViewModelFactory: TenantDatabaseViewModelFactory,
  ) {}

  /**
   * Handles the TenantDatabaseCreatedEvent event by adding a new tenant database view model.
   *
   * @param event - The TenantDatabaseCreatedEvent event to handle.
   */
  async handle(event: TenantDatabaseCreatedEvent) {
    this.logger.log(
      `Handling tenant database created event: ${event.aggregateId}`,
    );

    // 01: Create the tenant database view model
    const tenantDatabaseCreatedViewModel: TenantDatabaseViewModel =
      this.tenantDatabaseViewModelFactory.fromPrimitives(event.data);

    // 02: Save the tenant database view model
    await this.tenantDatabaseReadRepository.save(
      tenantDatabaseCreatedViewModel,
    );
  }
}
