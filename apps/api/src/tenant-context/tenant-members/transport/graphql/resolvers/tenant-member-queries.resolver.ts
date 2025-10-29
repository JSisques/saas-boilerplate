import { Criteria } from '@/shared/domain/entities/criteria';
import { FindTenantMembersByCriteriaQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-criteria/tenant-member-find-by-criteria.query';
import { TenantMemberFindByCriteriaRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-find-by-criteria.request.dto';
import { PaginatedTenantMemberResultDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/responses/tenant-member.response.dto';
import { TenantMemberGraphQLMapper } from '@/tenant-context/tenant-members/transport/graphql/mappers/tenant-member.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TenantMemberQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly tenantMemberGraphQLMapper: TenantMemberGraphQLMapper,
  ) {}

  /**
   * Finds tenant members that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param {TenantMemberFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
   * @returns {Promise<PaginatedTenantMemberResultDto>} A promise resolving to paginated results of tenant members matching the provided criteria.
   */
  @Query(() => PaginatedTenantMemberResultDto)
  async tenantMemberFindByCriteria(
    @Args('input', { nullable: true })
    input?: TenantMemberFindByCriteriaRequestDto,
  ): Promise<PaginatedTenantMemberResultDto> {
    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindTenantMembersByCriteriaQuery({ criteria }),
    );

    // 03: Convert to response DTO
    return this.tenantMemberGraphQLMapper.toPaginatedResponseDto(result);
  }
}
