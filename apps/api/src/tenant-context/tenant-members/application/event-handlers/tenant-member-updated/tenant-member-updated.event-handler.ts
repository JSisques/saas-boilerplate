import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberUpdatedEvent)
export class TenantMemberUpdatedEventHandler
  implements IEventHandler<TenantMemberUpdatedEvent>
{
  private readonly logger = new Logger(TenantMemberUpdatedEventHandler.name);

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
    private readonly assertTenantMemberViewModelExsistsService: AssertTenantMemberViewModelExsistsService,
  ) {}

  /**
   * Handles the TenantMemberUpdatedEvent event by updating the existing tenant member view model.
   *
   * @param event - The TenantMemberUpdatedEvent event to handle.
   */
  async handle(event: TenantMemberUpdatedEvent) {
    this.logger.log(
      `Handling tenant member updated event: ${event.aggregateId}`,
    );

    // 01: Assert the tenant member view model exists
    const existingTenantMemberViewModel =
      await this.assertTenantMemberViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingTenantMemberViewModel.update(event.data);

    // 03: Save the updated tenant member view model
    await this.tenantMemberReadRepository.save(existingTenantMemberViewModel);
  }
}
