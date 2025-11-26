import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantDatabasesByCriteriaQuery } from './tenant-database-find-by-criteria.query';

@QueryHandler(FindTenantDatabasesByCriteriaQuery)
export class FindTenantDatabasesByCriteriaQueryHandler
  implements IQueryHandler<FindTenantDatabasesByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindTenantDatabasesByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_DATABASE_READ_REPOSITORY_TOKEN)
    private readonly tenantDatabaseReadRepository: TenantDatabaseReadRepository,
  ) {}

  /**
   * Executes the FindTenantDatabasesByCriteriaQuery query.
   *
   * @param query - The FindTenantDatabasesByCriteriaQuery query to execute.
   * @returns The PaginatedResult of TenantDatabaseViewModels.
   */
  async execute(
    query: FindTenantDatabasesByCriteriaQuery,
  ): Promise<PaginatedResult<TenantDatabaseViewModel>> {
    this.logger.log(
      `Executing find tenant databases by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the tenant databases by criteria
    return this.tenantDatabaseReadRepository.findByCriteria(query.criteria);
  }
}
