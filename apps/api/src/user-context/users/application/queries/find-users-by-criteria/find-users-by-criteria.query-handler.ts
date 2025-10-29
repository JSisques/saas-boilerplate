import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUsersByCriteriaQuery } from './find-users-by-criteria.query';

@QueryHandler(FindUsersByCriteriaQuery)
export class FindUsersByCriteriaQueryHandler
  implements IQueryHandler<FindUsersByCriteriaQuery>
{
  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: UserReadRepository,
  ) {}

  async execute(
    query: FindUsersByCriteriaQuery,
  ): Promise<PaginatedResult<UserViewModel>> {
    return this.userReadRepository.findByCriteria(query.criteria);
  }
}
