import { FindTenantMemberByUserIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-user-id/tenant-member-find-by-user-id.query';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindTenantMemberByUserIdQuery)
export class FindTenantMemberByUserIdQueryHandler
  implements IQueryHandler<FindTenantMemberByUserIdQuery>
{
  private readonly logger = new Logger(
    FindTenantMemberByUserIdQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
  ) {}

  /**
   * Executes the FindTenantMemberByUserIdQuery query.
   *
   * @param query - The FindTenantMemberByUserIdQuery query to execute.
   * @returns The TenantMemberAggregates if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberByUserIdQuery,
  ): Promise<TenantMemberAggregate[] | null> {
    this.logger.log(
      `Executing find tenant member by user id query: ${query.userId.value}`,
    );

    // 01: Find the tenant members by user id
    return this.tenantMemberWriteRepository.findByUserId(query.userId.value);
  }
}
