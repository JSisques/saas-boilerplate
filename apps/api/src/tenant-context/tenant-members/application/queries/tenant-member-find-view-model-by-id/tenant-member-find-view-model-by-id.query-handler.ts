import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantMemberViewModelByIdQuery } from './tenant-member-find-view-model-by-id.query';

@QueryHandler(FindTenantMemberViewModelByIdQuery)
export class FindTenantMemberViewModelByIdQueryHandler
  implements IQueryHandler<FindTenantMemberViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindTenantMemberViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertTenantMemberViewModelExsistsService: AssertTenantMemberViewModelExsistsService,
  ) {}

  /**
   * Executes the FindTenantMemberByIdQuery query.
   *
   * @param query - The FindTenantMemberByIdQuery query to execute.
   * @returns The TenantMemberViewModel if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberViewModelByIdQuery,
  ): Promise<TenantMemberViewModel> {
    this.logger.log(
      `Executing find tenant member view model by id query: ${query.id.value}`,
    );

    // 01: Assert the tenant member view model exists
    return await this.assertTenantMemberViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
