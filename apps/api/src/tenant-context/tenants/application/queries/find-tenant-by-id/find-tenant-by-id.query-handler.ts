import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantByIdQuery } from './find-tenant-by-id.query';

@QueryHandler(FindTenantByIdQuery)
export class FindTenantByIdQueryHandler
  implements IQueryHandler<FindTenantByIdQuery>
{
  private readonly logger = new Logger(FindTenantByIdQueryHandler.name);

  constructor(
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
    private readonly assertTenantExsistsService: AssertTenantExsistsService,
  ) {}

  /**
   * Executes the FindTenantByIdQuery query.
   *
   * @param query - The FindTenantByIdQuery query to execute.
   * @returns The TenantAggregate if found, null otherwise.
   */
  async execute(query: FindTenantByIdQuery): Promise<TenantAggregate> {
    this.logger.log(`Executing find tenant by id query: ${query.id.value}`);

    // 01: Find the tenant by id
    const tenant = await this.tenantWriteRepository.findById(query.id.value);

    // 02: If the tenant does not exist, throw an error
    if (!tenant) {
      this.logger.error(`Tenant not found by id: ${query.id.value}`);
      throw new TenantNotFoundException(query.id.value);
    }

    return tenant;
  }
}
