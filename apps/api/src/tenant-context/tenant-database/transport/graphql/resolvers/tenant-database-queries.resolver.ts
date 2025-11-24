import { Criteria } from '@/shared/domain/entities/criteria';
import { FindTenantDatabasesByCriteriaQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.query';
import { FindTenantDatabaseViewModelByIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-view-model-by-id/tenant-database-find-view-model-by-id.query';
import { TenantDatabaseFindByCriteriaRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-find-by-criteria.request.dto';
import { TenantDatabaseFindByIdRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-find-by-id.request.dto';
import {
  PaginatedTenantDatabaseResultDto,
  TenantDatabaseResponseDto,
} from '@/tenant-context/tenant-database/transport/graphql/dtos/responses/tenant-database.response.dto';
import { TenantDatabaseGraphQLMapper } from '@/tenant-context/tenant-database/transport/graphql/mappers/tenant-database.mapper';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TenantDatabaseQueryResolver {
  private readonly logger = new Logger(TenantDatabaseQueryResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly tenantDatabaseGraphQLMapper: TenantDatabaseGraphQLMapper,
  ) {}

  /**
   * Finds tenant databases that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param {TenantDatabaseFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
   * @returns {Promise<PaginatedTenantDatabaseResultDto>} A promise resolving to paginated results of tenant databases matching the provided criteria.
   */
  @Query(() => PaginatedTenantDatabaseResultDto)
  async tenantDatabaseFindByCriteria(
    @Args('input', { nullable: true })
    input?: TenantDatabaseFindByCriteriaRequestDto,
  ): Promise<PaginatedTenantDatabaseResultDto> {
    this.logger.log(
      `Finding tenant databases by criteria: ${input?.filters?.toString()}`,
      `Sorts: ${input?.sorts?.toString()}`,
      `Pagination: ${input?.pagination?.toString()}`,
    );

    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindTenantDatabasesByCriteriaQuery({ criteria }),
    );

    // 03: Convert to response DTO
    return this.tenantDatabaseGraphQLMapper.toPaginatedResponseDto(result);
  }

  /**
   * Finds a tenant database by its id.
   *
   * @param {TenantDatabaseFindByIdRequestDto} input - The id of the tenant database to find.
   * @returns {Promise<TenantDatabaseResponseDto>} A promise resolving to the tenant database matching the provided id.
   */
  @Query(() => TenantDatabaseResponseDto)
  async tenantDatabaseFindById(
    @Args('input') input: TenantDatabaseFindByIdRequestDto,
  ): Promise<TenantDatabaseResponseDto> {
    this.logger.log(`Finding tenant database by id: ${input.id}`);

    // 01: Execute query
    const result = await this.queryBus.execute(
      new FindTenantDatabaseViewModelByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return this.tenantDatabaseGraphQLMapper.toResponseDto(result);
  }
}
