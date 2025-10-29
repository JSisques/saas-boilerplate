import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model.factory';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(TenantMemberAddedEvent)
export class TenantMemberAddedEventHandler
  implements IEventHandler<TenantMemberAddedEvent>
{
  private readonly logger = new Logger(TenantMemberAddedEventHandler.name);

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
    private readonly tenantMemberViewModelFactory: TenantMemberViewModelFactory,
  ) {}

  /**
   * Handles the TenantMemberAddedEvent event by adding a new tenant member view model.
   *
   * @param event - The TenantMemberAddedEvent event to handle.
   */
  async handle(event: TenantMemberAddedEvent) {
    this.logger.log(`Handling tenant member added event: ${event.aggregateId}`);

    // 01: Create the tenant member view model
    const tenantMemberAddedViewModel: TenantMemberViewModel =
      this.tenantMemberViewModelFactory.fromPrimitives(event.data);

    // 02: Save the tenant member view model
    await this.tenantMemberReadRepository.save(tenantMemberAddedViewModel);
  }
}
