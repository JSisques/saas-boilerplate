import { FindTenantMemberByTenantIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id/tenant-member-find-by-tenant-id.query';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindTenantMemberByTenantIdQuery)
export class FindTenantMemberByTenantIdQueryHandler
  implements IQueryHandler<FindTenantMemberByTenantIdQuery>
{
  private readonly logger = new Logger(
    FindTenantMemberByTenantIdQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
  ) {}

  /**
   * Executes the FindTenantMemberByTenantIdQuery query.
   *
   * @param query - The FindTenantMemberByTenantIdQuery query to execute.
   * @returns The TenantMemberViewModels if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberByTenantIdQuery,
  ): Promise<TenantMemberAggregate[] | null> {
    this.logger.log(
      `Executing find tenant member by tenant id query: ${query.tenantId.value}`,
    );

    // 01: Find the tenant members by tenant id
    return this.tenantMemberWriteRepository.findByTenantId(
      query.tenantId.value,
    );
  }
}
