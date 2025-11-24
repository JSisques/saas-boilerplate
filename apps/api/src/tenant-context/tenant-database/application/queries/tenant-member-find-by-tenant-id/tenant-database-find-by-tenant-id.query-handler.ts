import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantDatabaseByTenantIdQuery } from './tenant-database-find-by-tenant-id.query';

@QueryHandler(FindTenantDatabaseByTenantIdQuery)
export class FindTenantDatabaseByTenantIdQueryHandler
  implements IQueryHandler<FindTenantDatabaseByTenantIdQuery>
{
  private readonly logger = new Logger(
    FindTenantDatabaseByTenantIdQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
  ) {}

  /**
   * Executes the FindTenantDatabaseByTenantIdQuery query.
   *
   * @param query - The FindTenantDatabaseByTenantIdQuery query to execute.
   * @returns The TenantDatabaseViewModels if found, null otherwise.
   */
  async execute(
    query: FindTenantDatabaseByTenantIdQuery,
  ): Promise<TenantDatabaseAggregate[] | null> {
    this.logger.log(
      `Executing find tenant database by tenant id query: ${query.tenantId.value}`,
    );

    // 01: Find the tenant databases by tenant id
    return this.tenantDatabaseWriteRepository.findByTenantId(
      query.tenantId.value,
    );
  }
}
