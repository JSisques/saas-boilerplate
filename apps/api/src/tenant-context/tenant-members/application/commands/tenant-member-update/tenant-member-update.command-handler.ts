import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update.command-handler';
import { TenantMemberUpdateCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-update/tenant-member-update.command';
import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import { ITenantMemberUpdateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-update/tenant-member-update.dto';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantUpdateCommand } from '@/tenant-context/tenants/application/commands/tenant-update/tenant-update.command';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(TenantUpdateCommand)
export class TenantMemberUpdateCommandHandler
  extends BaseUpdateCommandHandler<
    TenantMemberUpdateCommand,
    ITenantMemberUpdateDto
  >
  implements ICommandHandler<TenantMemberUpdateCommand>
{
  protected readonly logger = new Logger(TenantMemberUpdateCommandHandler.name);

  constructor(
    private readonly assertTenantMemberExsistsService: AssertTenantMemberExsistsService,
    private readonly eventBus: EventBus,
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update tenant command
   *
   * @param command - The command to execute
   */
  async execute(command: TenantUpdateCommand): Promise<void> {
    this.logger.log(`Executing update tenant command by id: ${command.id}`);

    // 01: Check if the tenant exists
    const existingTenantMember =
      await this.assertTenantMemberExsistsService.execute(command.id.value);

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the tenant
    existingTenantMember.update(updateData);

    // 04: Save the tenant
    await this.tenantMemberWriteRepository.save(existingTenantMember);

    // 05: Publish the tenant updated event
    await this.eventBus.publishAll(existingTenantMember.getUncommittedEvents());
    await existingTenantMember.commit();
  }
}
