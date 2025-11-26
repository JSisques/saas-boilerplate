import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model/tenant-view-model.factory';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantCreatedEvent)
export class TenantCreatedEventHandler
  implements IEventHandler<TenantCreatedEvent>
{
  private readonly logger = new Logger(TenantCreatedEventHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
    private readonly tenantViewModelFactory: TenantViewModelFactory,
  ) {}

  /**
   * Handles the TenantCreatedEvent event by creating a new tenant view model.
   *
   * @param event - The TenantCreatedEvent event to handle.
   */
  async handle(event: TenantCreatedEvent) {
    this.logger.log(`Handling tenant created event: ${event.aggregateId}`);

    // 01: Create the tenant view model
    const tenantCreatedViewModel = this.tenantViewModelFactory.fromPrimitives(
      event.data,
    );

    // 02: Save the tenant view model
    await this.tenantReadRepository.save(tenantCreatedViewModel);
  }
}
