import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantsByCriteriaQuery } from './find-tenants-by-criteria.query';

@QueryHandler(FindTenantsByCriteriaQuery)
export class FindTenantsByCriteriaQueryHandler
  implements IQueryHandler<FindTenantsByCriteriaQuery>
{
  private readonly logger = new Logger(FindTenantsByCriteriaQueryHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
  ) {}

  /**
   * Executes the FindTenantsByCriteriaQuery query.
   *
   * @param query - The FindTenantsByCriteriaQuery query to execute.
   * @returns The PaginatedResult of TenantViewModels.
   */
  async execute(
    query: FindTenantsByCriteriaQuery,
  ): Promise<PaginatedResult<TenantViewModel>> {
    this.logger.log(
      `Executing find tenants by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the tenants by criteria
    return this.tenantReadRepository.findByCriteria(query.criteria);
  }
}
