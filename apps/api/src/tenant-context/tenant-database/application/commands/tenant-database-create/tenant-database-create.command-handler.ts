import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AssertTenantDatabaseNotExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-not-exsits/assert-tenant-database-not-exsits.service';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { FindTenantByIdQuery } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query';
import { Inject, Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { TenantDatabaseCreateCommand } from './tenant-database-create.command';

@CommandHandler(TenantDatabaseCreateCommand)
export class TenantDatabaseCreateCommandHandler
  implements ICommandHandler<TenantDatabaseCreateCommand>
{
  private readonly logger = new Logger(TenantDatabaseCreateCommandHandler.name);

  constructor(
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly tenantDatabaseAggregateFactory: TenantDatabaseAggregateFactory,
    private readonly assertTenantDatabaseNotExsistsService: AssertTenantDatabaseNotExsistsService,
  ) {}

  /**
   * Executes the tenant create command
   *
   * @param command - The command to execute
   * @returns The created tenant id
   */
  async execute(command: TenantDatabaseCreateCommand): Promise<string> {
    this.logger.log(
      `Executing tenant database create command with tenant id ${command.tenantId.value}`,
    );

    // 01: Assert the tenant database is not exsists
    await this.assertTenantDatabaseNotExsistsService.execute(command.id.value);

    // 02: Assert the tenant exists
    await this.queryBus.execute(
      new FindTenantByIdQuery({ id: command.tenantId.value }),
    );

    // 04: Create the tenant database entity
    const tenantDatabase = this.tenantDatabaseAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    });

    // 05: Save the tenant database entity
    await this.tenantDatabaseWriteRepository.save(tenantDatabase);

    // 06: Publish all events
    await this.eventBus.publishAll(tenantDatabase.getUncommittedEvents());
    await tenantDatabase.commit();

    // 07: Return the tenant database id
    return tenantDatabase.id.value;
  }
}
