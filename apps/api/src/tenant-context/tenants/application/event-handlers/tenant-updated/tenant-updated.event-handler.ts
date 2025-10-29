import { TenantUpdatedEvent } from '@/shared/domain/events/tenants/tenant-updated/tenant-updated.event';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantUpdatedEvent)
export class TenantUpdatedEventHandler
  implements IEventHandler<TenantUpdatedEvent>
{
  private readonly logger = new Logger(TenantUpdatedEventHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
    private readonly assertTenantViewModelExsistsService: AssertTenantViewModelExsistsService,
  ) {}

  /**
   * Handles the TenantUpdatedEvent event by updating the existing tenant view model.
   *
   * @param event - The TenantUpdatedEvent event to handle.
   */
  async handle(event: TenantUpdatedEvent) {
    this.logger.log(`Handling tenant updated event: ${event.aggregateId}`);

    // 01: Assert the tenant view model exists
    const existingTenantViewModel =
      await this.assertTenantViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingTenantViewModel.update(event.data);

    // 03: Save the updated tenant view model
    await this.tenantReadRepository.save(existingTenantViewModel);
  }
}
