import { UserViewModel } from '@/features/users/domain/view-models/user.view-model';
import {
  PaginatedUserResultDto,
  UserResponseDto,
} from '@/features/users/transport/graphql/dtos/responses/user.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable } from '@nestjs/common';

export const USER_GRAPHQL_MAPPER_TOKEN = Symbol('UserGraphQLMapper');

@Injectable()
export class UserGraphQLMapper {
  toResponseDto(user: UserViewModel): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      userName: user.userName,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<UserViewModel>,
  ): PaginatedUserResultDto {
    return {
      items: paginatedResult.items.map((user) => this.toResponseDto(user)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
