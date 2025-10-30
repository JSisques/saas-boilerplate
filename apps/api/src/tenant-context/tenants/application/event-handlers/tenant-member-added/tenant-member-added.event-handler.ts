import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { FindTenantMemberByTenantIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id/tenant-member-find-by-tenant-id.query';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model.factory';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenants/domain/view-models/tenant-member/tenant-member.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

@EventsHandler(TenantMemberAddedEvent)
export class TenantMemberAddedEventHandler
  implements IEventHandler<TenantMemberAddedEvent>
{
  private readonly logger = new Logger(TenantMemberAddedEventHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
    private readonly tenantViewModelFactory: TenantViewModelFactory,
    private readonly assertTenantExsistsService: AssertTenantExsistsService,
    private readonly assertTenantViewModelExsistsService: AssertTenantViewModelExsistsService,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the TenantMemberAddedEvent event by creating a new tenant member view model.
   *
   * @param event - The TenantMemberAddedEvent event to handle.
   */
  async handle(event: TenantMemberAddedEvent) {
    this.logger.log(
      `Updating tenant member added in tenant event: ${event.aggregateId}`,
    );

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
