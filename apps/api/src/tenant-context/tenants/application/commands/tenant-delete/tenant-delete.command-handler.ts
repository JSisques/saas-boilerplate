import { TenantDeleteCommand } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(TenantDeleteCommand)
export class TenantDeleteCommandHandler
  implements ICommandHandler<TenantDeleteCommand>
{
  private readonly logger = new Logger(TenantDeleteCommandHandler.name);

  constructor(
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertTenantExsistsService: AssertTenantExsistsService,
  ) {}

  async execute(command: TenantDeleteCommand): Promise<void> {
    this.logger.log(`Executing delete tenant command by id: ${command.id}`);

    // 01: Check if the tenant exists
    const existingTenant = await this.assertTenantExsistsService.execute(
      command.id.value,
    );

    // 02: Delete the user
    await existingTenant.delete();

    // 04: Delete the user from the repository
    await this.tenantWriteRepository.delete(existingTenant.id.value);

    // 05: Publish the user deleted event
    await this.eventBus.publishAll(existingTenant.getUncommittedEvents());
    await existingTenant.commit();
  }
}
