import { AssertTenantSlugIsUniqueService } from '@/tenant-context/tenants/application/services/assert-tenant-slug-is-unique/assert-tenant-slug-is-unique.service';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate.factory';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TenantCreateCommand } from './tenant-create.command';

@CommandHandler(TenantCreateCommand)
export class TenantCreateCommandHandler
  implements ICommandHandler<TenantCreateCommand>
{
  constructor(
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly tenantAggregateFactory: TenantAggregateFactory,
    private readonly assertTenantSlugIsUniqueService: AssertTenantSlugIsUniqueService,
  ) {}

  /**
   * Executes the tenant create command
   *
   * @param command - The command to execute
   * @returns The created tenant id
   */
  async execute(command: TenantCreateCommand): Promise<string> {
    // 01: Assert the tenant slug is unique
    await this.assertTenantSlugIsUniqueService.execute(command.slug.value);

    // 02: Create the tenant entity
    const tenant = this.tenantAggregateFactory.create({
      ...command,
    });

    // 03: Save the tenant entity
    await this.tenantWriteRepository.save(tenant);

    // 04: Publish all events
    await this.eventBus.publishAll(tenant.getUncommittedEvents());
    await tenant.commit();

    // 05: Return the tenant id
    return tenant.id.value;
  }
}
