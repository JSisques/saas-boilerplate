import { TenantDatabaseDeleteCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command';
import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(TenantDatabaseDeleteCommand)
export class TenantDatabaseDeleteCommandHandler
  implements ICommandHandler<TenantDatabaseDeleteCommand>
{
  private readonly logger = new Logger(TenantDatabaseDeleteCommandHandler.name);

  constructor(
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertTenantDatabaseExsistsService: AssertTenantDatabaseExsistsService,
  ) {}

  /**
   * Executes the tenant database delete command.
   *
   * @param command - The command to execute.
   * @returns The void.
   */
  async execute(command: TenantDatabaseDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing delete tenant database command by id: ${command.id}`,
    );

    // 01: Check if the tenant exists
    const existingTenantDatabase =
      await this.assertTenantDatabaseExsistsService.execute(command.id.value);

    // 02: Delete the user
    await existingTenantDatabase.delete();

    // 04: Delete the user from the repository
    await this.tenantDatabaseWriteRepository.delete(
      existingTenantDatabase.id.value,
    );

    // 05: Publish the user deleted event
    await this.eventBus.publishAll(
      existingTenantDatabase.getUncommittedEvents(),
    );
    await existingTenantDatabase.commit();
  }
}
