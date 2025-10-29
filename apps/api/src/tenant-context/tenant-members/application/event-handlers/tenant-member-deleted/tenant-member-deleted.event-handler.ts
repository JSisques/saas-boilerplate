import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberRemovedEvent)
export class TenantMemberRemovedEventHandler
  implements IEventHandler<TenantMemberRemovedEvent>
{
  private readonly logger = new Logger(TenantMemberRemovedEventHandler.name);

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
    private readonly assertTenantMemberViewModelExsistsService: AssertTenantMemberViewModelExsistsService,
  ) {}

  /**
   * Handles the TenantMemberRemovedEvent event by removing the existing tenant member view model.
   *
   * @param event - The TenantMemberRemovedEvent event to handle.
   */
  async handle(event: TenantMemberRemovedEvent) {
    this.logger.log(
      `Handling tenant member removed event: ${event.aggregateId}`,
    );

    // 01: Assert the tenant member view model exists
    const existingTenantMemberViewModel =
      await this.assertTenantMemberViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the tenant member view model
    await this.tenantMemberReadRepository.delete(
      existingTenantMemberViewModel.id,
    );
  }
}
