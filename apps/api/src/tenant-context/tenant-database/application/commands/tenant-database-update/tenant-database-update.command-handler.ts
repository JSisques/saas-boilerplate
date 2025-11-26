import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import { ITenantDatabaseUpdateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-update/tenant-database-update.dto';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(TenantDatabaseUpdateCommand)
export class TenantDatabaseUpdateCommandHandler
  extends BaseUpdateCommandHandler<
    TenantDatabaseUpdateCommand,
    ITenantDatabaseUpdateDto
  >
  implements ICommandHandler<TenantDatabaseUpdateCommand>
{
  protected readonly logger = new Logger(
    TenantDatabaseUpdateCommandHandler.name,
  );

  constructor(
    private readonly assertTenantDatabaseExsistsService: AssertTenantDatabaseExsistsService,
    private readonly eventBus: EventBus,
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update tenant database command
   *
   * @param command - The command to execute
   */
  async execute(command: TenantDatabaseUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update tenant database command by id: ${command.id}`,
    );

    // 01: Check if the tenant database exists
    const existingTenantDatabase =
      await this.assertTenantDatabaseExsistsService.execute(command.id.value);

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the tenant database
    existingTenantDatabase.update(updateData);

    // 04: Save the tenant database
    await this.tenantDatabaseWriteRepository.save(existingTenantDatabase);

    // 05: Publish the tenant database updated event
    await this.eventBus.publishAll(
      existingTenantDatabase.getUncommittedEvents(),
    );
    await existingTenantDatabase.commit();
  }
}
