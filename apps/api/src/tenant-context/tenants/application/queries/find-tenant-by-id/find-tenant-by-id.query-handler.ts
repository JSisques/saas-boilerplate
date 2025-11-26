import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantByIdQuery } from './find-tenant-by-id.query';

@QueryHandler(FindTenantByIdQuery)
export class FindTenantByIdQueryHandler
  implements IQueryHandler<FindTenantByIdQuery>
{
  private readonly logger = new Logger(FindTenantByIdQueryHandler.name);

  constructor(
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
    return await this.assertTenantExsistsService.execute(query.id.value);
  }
}
