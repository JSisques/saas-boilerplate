import { FindAuthsByCriteriaQuery } from '@/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query';
import { AuthFindByCriteriaRequestDto } from '@/auth/transport/graphql/dtos/requests/auth-find-by-criteria.request.dto';
import { PaginatedAuthResultDto } from '@/auth/transport/graphql/dtos/responses/auth.response.dto';
import {
  AUTH_GRAPHQL_MAPPER_TOKEN,
  AuthGraphQLMapper,
} from '@/auth/transport/graphql/mappers/auth.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(AUTH_GRAPHQL_MAPPER_TOKEN)
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
