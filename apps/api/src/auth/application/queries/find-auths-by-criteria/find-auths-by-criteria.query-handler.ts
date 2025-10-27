import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth/domain/view-models/auth.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAuthsByCriteriaQuery } from './find-auths-by-criteria.query';

@QueryHandler(FindAuthsByCriteriaQuery)
export class FindAuthsByCriteriaQueryHandler
  implements IQueryHandler<FindAuthsByCriteriaQuery>
{
  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
  ) {}

  async execute(
    query: FindAuthsByCriteriaQuery,
  ): Promise<PaginatedResult<AuthViewModel>> {
    return this.authReadRepository.findByCriteria(query.criteria);
  }
}
