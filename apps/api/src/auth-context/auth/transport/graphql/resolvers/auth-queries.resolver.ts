import { FindAuthsByCriteriaQuery } from '@/auth-context/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query';
import { AuthFindByCriteriaRequestDto } from '@/auth-context/auth/transport/graphql/dtos/requests/auth-find-by-criteria.request.dto';
import { PaginatedAuthResultDto } from '@/auth-context/auth/transport/graphql/dtos/responses/auth.response.dto';
import { AuthGraphQLMapper } from '@/auth-context/auth/transport/graphql/mappers/auth.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authGraphQLMapper: AuthGraphQLMapper,
  ) {}

  @Query(() => PaginatedAuthResultDto)
  async findAuthsByCriteria(
    @Args('input', { nullable: true }) input?: AuthFindByCriteriaRequestDto,
  ): Promise<PaginatedAuthResultDto> {
    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindAuthsByCriteriaQuery(criteria),
    );

    // 03: Convert to response DTO
    return this.authGraphQLMapper.toPaginatedResponseDto(result);
  }
}
