import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantDatabaseByIdQuery } from './tenant-database-find-by-id.query';

@QueryHandler(FindTenantDatabaseByIdQuery)
export class FindTenantDatabaseByIdQueryHandler
  implements IQueryHandler<FindTenantDatabaseByIdQuery>
{
  private readonly logger = new Logger(FindTenantDatabaseByIdQueryHandler.name);

  constructor(
    private readonly assertTenantDatabaseExsistsService: AssertTenantDatabaseExsistsService,
  ) {}

  /**
   * Executes the FindTenantDatabaseByIdQuery query.
   *
   * @param query - The FindTenantDatabaseByIdQuery query to execute.
   * @returns The TenantDatabaseAggregate if found, null otherwise.
   */
  async execute(
    query: FindTenantDatabaseByIdQuery,
  ): Promise<TenantDatabaseAggregate> {
    this.logger.log(
      `Executing find tenant database by id query: ${query.id.value}`,
    );

    // 01: Assert the tenant database aggregate exists
    return await this.assertTenantDatabaseExsistsService.execute(
      query.id.value,
    );
  }
}
