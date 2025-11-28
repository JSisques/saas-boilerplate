import { FindTenantMemberByTenantIdAndUserIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id-and-user-id/tenant-member-find-by-tenant-id-and-user-id.query';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindTenantMemberByTenantIdAndUserIdQuery)
export class FindTenantMemberByTenantIdAndUserIdQueryHandler
  implements IQueryHandler<FindTenantMemberByTenantIdAndUserIdQuery>
{
  private readonly logger = new Logger(
    FindTenantMemberByTenantIdAndUserIdQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
  ) {}

  /**
   * Executes the FindTenantMemberByTenantIdAndUserIdQuery query.
   *
   * @param query - The FindTenantMemberByTenantIdAndUserIdQuery query to execute.
   * @returns The TenantMemberViewModels if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberByTenantIdAndUserIdQuery,
  ): Promise<TenantMemberAggregate | null> {
    this.logger.log(
      `Executing find tenant member by tenant id and user id query: ${query.tenantId.value} and ${query.userId.value}`,
    );

    // 01: Find the tenant members by tenant id
    return this.tenantMemberWriteRepository.findByTenantIdAndUserId(
      query.tenantId.value,
      query.userId.value,
    );
  }
}
