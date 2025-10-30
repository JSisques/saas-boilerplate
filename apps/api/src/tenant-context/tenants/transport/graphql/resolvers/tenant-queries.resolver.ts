import { Criteria } from '@/shared/domain/entities/criteria';
import { FindTenantsByCriteriaQuery } from '@/tenant-context/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query';
import { TenantFindByCriteriaRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-find-by-criteria.request.dto';
import { PaginatedTenantResultDto } from '@/tenant-context/tenants/transport/graphql/dtos/responses/tenant/tenant.response.dto';
import { TenantGraphQLMapper } from '@/tenant-context/tenants/transport/graphql/mappers/tenant.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TenantQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly tenantGraphQLMapper: TenantGraphQLMapper,
  ) {}

  /**
   * Finds tenants that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param {TenantFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
   * @returns {Promise<PaginatedTenantResultDto>} A promise resolving to paginated results of tenants matching the provided criteria.
   */
  @Query(() => PaginatedTenantResultDto)
  async tenantFindByCriteria(
    @Args('input', { nullable: true }) input?: TenantFindByCriteriaRequestDto,
  ): Promise<PaginatedTenantResultDto> {
    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindTenantsByCriteriaQuery({ criteria }),
    );

    // 03: Convert to response DTO
    return this.tenantGraphQLMapper.toPaginatedResponseDto(result);
  }
}
