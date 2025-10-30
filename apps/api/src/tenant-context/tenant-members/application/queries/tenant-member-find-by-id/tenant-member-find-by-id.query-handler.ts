import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantMemberByIdQuery } from './tenant-member-find-by-id.query';

@QueryHandler(FindTenantMemberByIdQuery)
export class FindTenantMemberByIdQueryHandler
  implements IQueryHandler<FindTenantMemberByIdQuery>
{
  private readonly logger = new Logger(FindTenantMemberByIdQueryHandler.name);

  constructor(
    private readonly assertTenantMemberExsistsService: AssertTenantMemberExsistsService,
  ) {}

  /**
   * Executes the FindTenantMemberByIdQuery query.
   *
   * @param query - The FindTenantMemberByIdQuery query to execute.
   * @returns The TenantMemberViewModel if found, null otherwise.
   */
  async execute(
    query: FindTenantMemberByIdQuery,
  ): Promise<TenantMemberAggregate> {
    this.logger.log(
      `Executing find tenant member by id query: ${query.id.value}`,
    );

    // 01: Assert the tenant member view model exists
    return await this.assertTenantMemberExsistsService.execute(query.id.value);
  }
}
