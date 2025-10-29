import { TenantDeletedEvent } from '@/shared/domain/events/tenants/tenant-deleted/tenant-deleted.event';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantDeletedEvent)
export class TenantDeletedEventHandler
  implements IEventHandler<TenantDeletedEvent>
{
  private readonly logger = new Logger(TenantDeletedEventHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
    private readonly assertTenantViewModelExsistsService: AssertTenantViewModelExsistsService,
  ) {}

  /**
   * Handles the TenantDeletedEvent event by deleting the existing tenant view model.
   *
   * @param event - The TenantDeletedEvent event to handle.
   */
  async handle(event: TenantDeletedEvent) {
    this.logger.log(`Handling tenant deleted event: ${event.aggregateId}`);

    // 01: Assert the tenant view model exists
    const existingTenantViewModel =
      await this.assertTenantViewModelExsistsService.execute(event.aggregateId);

    // 02: Delete the tenant view model
    await this.tenantReadRepository.delete(existingTenantViewModel.id);
  }
}
