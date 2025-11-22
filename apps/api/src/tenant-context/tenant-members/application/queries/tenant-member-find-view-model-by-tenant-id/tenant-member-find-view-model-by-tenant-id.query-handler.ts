import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model/tenant-member-view-model.factory';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantMemberViewModelByTenantIdQuery } from './tenant-member-find-view-model-by-tenant-id.query';

@QueryHandler(FindTenantMemberViewModelByTenantIdQuery)
export class FindTenantMemberViewModelByTenantIdQueryHandler
  implements IQueryHandler<FindTenantMemberViewModelByTenantIdQuery>
{
  private readonly logger = new Logger(
    FindTenantMemberViewModelByTenantIdQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
    private readonly tenantMemberViewModelFactory: TenantMemberViewModelFactory,
  ) {}

  /**
   * Executes the FindTenantMemberByTenantIdQuery query.
   *
   * @param query - The FindTenantMemberByTenantIdQuery query to execute.
   * @returns The TenantMemberViewModels if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberViewModelByTenantIdQuery,
  ): Promise<TenantMemberViewModel[] | null> {
    this.logger.log(
      `Executing find tenant member view model by tenant id query: ${query.tenantId.value}`,
    );

    // 01: Find the tenant members by tenant id
    const tenantMembers = await this.tenantMemberReadRepository.findByTenantId(
      query.tenantId.value,
    );

    return (
      tenantMembers?.map((tenantMember) => {
        return this.tenantMemberViewModelFactory.fromPrimitives(tenantMember);
      }) ?? []
    );
  }
}
