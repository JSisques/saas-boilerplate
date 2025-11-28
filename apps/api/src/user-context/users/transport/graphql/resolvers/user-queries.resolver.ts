import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { OwnerGuard } from '@/auth-context/auth/infrastructure/guards/owner/owner.guard';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/prisma/master/client';
import { Criteria } from '@/shared/domain/entities/criteria';
import { FindUsersByCriteriaQuery } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query';
import { UserViewModelFindByIdQuery } from '@/user-context/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query';
import { UserFindByCriteriaRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/user-find-by-criteria.request.dto';
import { UserFindByIdRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/user-find-by-id.request.dto';
import {
  PaginatedUserResultDto,
  UserResponseDto,
} from '@/user-context/users/transport/graphql/dtos/responses/user.response.dto';
import { UserGraphQLMapper } from '@/user-context/users/transport/graphql/mappers/user.mapper';
import { UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userGraphQLMapper: UserGraphQLMapper,
  ) {}

  @Query(() => PaginatedUserResultDto)
  @Roles(UserRoleEnum.ADMIN)
  async usersFindByCriteria(
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

  @Query(() => UserResponseDto)
  @UseGuards(OwnerGuard)
  async userFindById(
    @Args('input') input: UserFindByIdRequestDto,
  ): Promise<UserResponseDto> {
    // 01: Execute query
    const result = await this.queryBus.execute(
      new UserViewModelFindByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return this.userGraphQLMapper.toResponseDto(result);
  }
}
