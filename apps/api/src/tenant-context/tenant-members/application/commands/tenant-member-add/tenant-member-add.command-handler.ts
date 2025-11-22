import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AssertTenantMemberNotExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-not-exsits/assert-tenant-member-not-exsits.service';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { FindTenantByIdQuery } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { Inject, Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { TenantMemberAddCommand } from './tenant-member-add.command';

@CommandHandler(TenantMemberAddCommand)
export class TenantMemberAddCommandHandler
  implements ICommandHandler<TenantMemberAddCommand>
{
  private readonly logger = new Logger(TenantMemberAddCommandHandler.name);

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
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
    this.logger.log(
      `Executing tenant member add command with tenant id ${command.tenantId.value} and user id ${command.userId.value}`,
    );

    // 01: Assert the tenant member is not exsists
    await this.assertTenantMemberNotExsistsService.execute({
      tenantId: command.tenantId.value,
      userId: command.userId.value,
    });

    // 02: Assert the tenant exists
    await this.queryBus.execute(
      new FindTenantByIdQuery({ id: command.tenantId.value }),
    );

    // 03: Assert the user exists
    await this.queryBus.execute(
      new UserFindByIdQuery({ id: command.userId.value }),
    );

    // 04: Create the tenant member entity
    const tenantMember = this.tenantMemberAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    });

    // 05: Save the tenant member entity
    await this.tenantMemberWriteRepository.save(tenantMember);

    // 06: Publish all events
    await this.eventBus.publishAll(tenantMember.getUncommittedEvents());
    await tenantMember.commit();

    // 07: Return the tenant member id
    return tenantMember.id.value;
  }
}
