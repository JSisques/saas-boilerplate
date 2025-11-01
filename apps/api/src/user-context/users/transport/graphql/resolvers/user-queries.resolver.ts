import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { Criteria } from '@/shared/domain/entities/criteria';
import { FindUsersByCriteriaQuery } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query';
import { UserFindByCriteriaRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/user-find-by-criteria.request.dto';
import { PaginatedUserResultDto } from '@/user-context/users/transport/graphql/dtos/responses/user.response.dto';
import { UserGraphQLMapper } from '@/user-context/users/transport/graphql/mappers/user.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoleEnum } from '@prisma/client';

@Resolver()
export class UserQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userGraphQLMapper: UserGraphQLMapper,
  ) {}

  @Query(() => PaginatedUserResultDto)
  @Roles(UserRoleEnum.ADMIN)
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
