import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(UserFindByIdQuery)
export class UserFindByIdQueryHandler
  implements IQueryHandler<UserFindByIdQuery>
{
  private readonly logger = new Logger(UserFindByIdQueryHandler.name);

  constructor(
    private readonly assertUserExsistsService: AssertUserExsistsService,
  ) {}

  /**
   * Executes the UserFindByIdQuery query.
   *
   * @param query - The UserFindByIdQuery query to execute.
   * @returns The UserViewModel if found, null otherwise.
   */
  async execute(query: UserFindByIdQuery): Promise<UserAggregate> {
    this.logger.log(`Executing user find by id query: ${query.id.value}`);

    // 01: Find the user by id
    return await this.assertUserExsistsService.execute(query.id.value);
  }
}
