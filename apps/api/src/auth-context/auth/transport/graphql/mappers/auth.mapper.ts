import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import {
  AuthResponseDto,
  PaginatedAuthResultDto,
} from '@/auth-context/auth/transport/graphql/dtos/responses/auth.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable } from '@nestjs/common';

export const AUTH_GRAPHQL_MAPPER_TOKEN = Symbol('AuthGraphQLMapper');

@Injectable()
export class AuthGraphQLMapper {
  toResponseDto(auth: AuthViewModel): AuthResponseDto {
    return {
      id: auth.id,
      userId: auth.userId,
      email: auth.email,
      emailVerified: auth.emailVerified,
      lastLoginAt: auth.lastLoginAt,
      passwordHash: auth.passwordHash,
      provider: auth.provider,
      providerId: auth.providerId,
      twoFactorEnabled: auth.twoFactorEnabled,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<AuthViewModel>,
  ): PaginatedAuthResultDto {
    return {
      items: paginatedResult.items.map((auth) => this.toResponseDto(auth)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
