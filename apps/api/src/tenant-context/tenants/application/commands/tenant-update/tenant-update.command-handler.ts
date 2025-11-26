import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { TenantUpdateCommand } from '@/tenant-context/tenants/application/commands/tenant-update/tenant-update.command';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { ITenantUpdateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-update/tenant-update.dto';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(TenantUpdateCommand)
export class TenantUpdateCommandHandler
  extends BaseUpdateCommandHandler<TenantUpdateCommand, ITenantUpdateDto>
  implements ICommandHandler<TenantUpdateCommand>
{
  protected readonly logger = new Logger(TenantUpdateCommandHandler.name);

  constructor(
    private readonly assertTenantExsistsService: AssertTenantExsistsService,
    private readonly eventBus: EventBus,
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
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
    const existingTenant = await this.assertTenantExsistsService.execute(
      command.id.value,
    );

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the tenant
    existingTenant.update(updateData);

    // 04: Save the tenant
    await this.tenantWriteRepository.save(existingTenant);

    // 05: Publish the tenant updated event
    await this.eventBus.publishAll(existingTenant.getUncommittedEvents());
    await existingTenant.commit();
  }
}
