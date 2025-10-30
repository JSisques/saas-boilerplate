import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { FindTenantMemberByTenantIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id/tenant-member-find-by-tenant-id.query';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenants/domain/view-models/tenant-member/tenant-member.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

@EventsHandler(TenantMemberRemovedEvent)
export class TenantMemberRemovedEventHandler
  implements IEventHandler<TenantMemberRemovedEvent>
{
  private readonly logger = new Logger(TenantMemberRemovedEventHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
    private readonly assertTenantViewModelExsistsService: AssertTenantViewModelExsistsService,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the TenantMemberRemovedEvent event by removing a tenant member view model.
   *
   * @param event - The TenantMemberRemovedEvent event to handle.
   */
  async handle(event: TenantMemberRemovedEvent) {
    this.logger.log(
      `Updating tenant member removed in tenant event: ${event.aggregateId}`,
    );

    // TODO: Extrat in a service cause is the same as the tenant member added event handler

    // 01: Find the tenant members by tenant id
    const tenantMembers = await this.queryBus.execute(
      new FindTenantMemberByTenantIdQuery({
        id: event.data.tenantId,
      }),
    );

    // 02: Assert the tenant exists
    const existingTenantViewModel =
      await this.assertTenantViewModelExsistsService.execute(
        event.data.tenantId,
      );

    // 03: Update the tenant view model with the new tenant members
    existingTenantViewModel.update({
      tenantMembers: tenantMembers.map((tenantMember) => {
        return new TenantMemberViewModel({
          id: tenantMember.id.value,
          userId: tenantMember.userId.value,
          role: tenantMember.role.value,
          createdAt: event.ocurredAt,
          updatedAt: event.ocurredAt,
        });
      }),
    });

    // 04: Save the tenant view model
    await this.tenantReadRepository.save(existingTenantViewModel);
  }
}
