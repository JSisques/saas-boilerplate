import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantMemberByIdQuery } from './tenant-member-find-by-id.query';

@QueryHandler(FindTenantMemberByIdQuery)
export class FindTenantMemberByIdQueryHandler
  implements IQueryHandler<FindTenantMemberByIdQuery>
{
  private readonly logger = new Logger(FindTenantMemberByIdQueryHandler.name);

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
    private readonly assertTenantMemberViewModelExsistsService: AssertTenantMemberViewModelExsistsService,
  ) {}

  /**
   * Executes the FindTenantMemberByIdQuery query.
   *
   * @param query - The FindTenantMemberByIdQuery query to execute.
   * @returns The TenantMemberViewModel if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberByIdQuery,
  ): Promise<TenantMemberViewModel> {
    this.logger.log(
      `Executing find tenant member by id query: ${query.id.value}`,
    );

    // 01: Assert the tenant member view model exists
    return await this.assertTenantMemberViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
