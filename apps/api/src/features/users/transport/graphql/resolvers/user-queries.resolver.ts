import { FindUsersByCriteriaQuery } from '@/features/users/application/queries/find-users-by-criteria/find-users-by-criteria.query';
import { UserFindByCriteriaRequestDto } from '@/features/users/transport/graphql/dtos/requests/user-find-by-criteria.request.dto';
import { PaginatedUserResultDto } from '@/features/users/transport/graphql/dtos/responses/user.response.dto';
import {
  USER_GRAPHQL_MAPPER_TOKEN,
  UserGraphQLMapper,
} from '@/features/users/transport/graphql/mappers/user.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(USER_GRAPHQL_MAPPER_TOKEN)
    private readonly userGraphQLMapper: UserGraphQLMapper,
  ) {}

  @Query(() => PaginatedUserResultDto)
  async findUsersByCriteria(
    @Args('input', { nullable: true }) input?: UserFindByCriteriaRequestDto,
  ): Promise<PaginatedUserResultDto> {
    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindUsersByCriteriaQuery(criteria),
    );

    // 03: Convert to response DTO
    return this.userGraphQLMapper.toPaginatedResponseDto(result);
  }
}
