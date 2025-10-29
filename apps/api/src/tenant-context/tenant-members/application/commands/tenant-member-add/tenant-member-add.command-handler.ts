import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { AssertTenantMemberNotExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-not-exsits/assert-tenant-member-not-exsits.service';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate.factory';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TenantMemberAddCommand } from './tenant-member-add.command';

@CommandHandler(TenantMemberAddCommand)
export class TenantMemberAddCommandHandler
  implements ICommandHandler<TenantMemberAddCommand>
{
  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
    private readonly eventBus: EventBus,
    private readonly tenantMemberAggregateFactory: TenantMemberAggregateFactory,
    private readonly assertTenantMemberNotExsistsService: AssertTenantMemberNotExsistsService,
  ) {}

  /**
   * Executes the tenant create command
   *
   * @param command - The command to execute
   * @returns The created tenant id
   */
  async execute(command: TenantMemberAddCommand): Promise<string> {
    // 01: Assert the tenant slug is unique
    await this.assertTenantMemberNotExsistsService.execute({
      tenantId: command.tenantId.value,
      userId: command.userId.value,
    });

    // 02: Create the tenant entity
    const tenantMember = this.tenantMemberAggregateFactory.create({
      id: TenantUuidValueObject.generate().value,
      ...command,
    });

    // 03: Save the tenant entity
    await this.tenantMemberWriteRepository.save(tenantMember);

    // 04: Publish all events
    await this.eventBus.publishAll(tenantMember.getUncommittedEvents());
    await tenantMember.commit();

    // 05: Return the tenant id
    return tenantMember.id.value;
  }
}
