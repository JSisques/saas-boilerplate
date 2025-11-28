import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FindTenantMembersByCriteriaQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-criteria/tenant-member-find-by-criteria.query';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindTenantMembersByCriteriaQuery)
export class FindTenantMembersByCriteriaQueryHandler
  implements IQueryHandler<FindTenantMembersByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindTenantMembersByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
  ) {}

  /**
   * Executes the FindTenantMembersByCriteriaQuery query.
   *
   * @param query - The FindTenantMembersByCriteriaQuery query to execute.
   * @returns The PaginatedResult of TenantMemberViewModels.
   */
  async execute(
    query: FindTenantMembersByCriteriaQuery,
  ): Promise<PaginatedResult<TenantMemberViewModel>> {
    this.logger.log(
      `Executing find tenant members by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the tenant members by criteria
    return this.tenantMemberReadRepository.findByCriteria(query.criteria);
  }
}
