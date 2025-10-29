import { TenantMemberRemoveCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-remove/tenant-member-remove.command';
import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(TenantMemberRemoveCommand)
export class TenantMemberRemoveCommandHandler
  implements ICommandHandler<TenantMemberRemoveCommand>
{
  private readonly logger = new Logger(TenantMemberRemoveCommandHandler.name);

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertTenantMemberExsistsService: AssertTenantMemberExsistsService,
  ) {}

  /**
   * Executes the tenant member remove command.
   *
   * @param command - The command to execute.
   * @returns The void.
   */
  async execute(command: TenantMemberRemoveCommand): Promise<void> {
    this.logger.log(
      `Executing remove tenant member command by id: ${command.id}`,
    );

    // 01: Check if the tenant exists
    const existingTenantMember =
      await this.assertTenantMemberExsistsService.execute(command.id.value);

    // 02: Delete the user
    await existingTenantMember.delete();

    // 04: Delete the user from the repository
    await this.tenantMemberWriteRepository.delete(
      existingTenantMember.id.value,
    );

    // 05: Publish the user deleted event
    await this.eventBus.publishAll(existingTenantMember.getUncommittedEvents());
    await existingTenantMember.commit();
  }
}
