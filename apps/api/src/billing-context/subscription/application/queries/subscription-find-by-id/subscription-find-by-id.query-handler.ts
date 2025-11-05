import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionByIdQuery } from './subscription-find-by-id.query';

@QueryHandler(FindSubscriptionByIdQuery)
export class FindSubscriptionByIdQueryHandler
  implements IQueryHandler<FindSubscriptionByIdQuery>
{
  private readonly logger = new Logger(FindSubscriptionByIdQueryHandler.name);

  constructor(
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
  ) {}

  /**
   * Executes the FindSubscriptionByIdQuery query.
   *
   * @param query - The FindSubscriptionByIdQuery query to execute.
   * @returns The SubscriptionAggregate if found, null otherwise.
   */
  async execute(
    query: FindSubscriptionByIdQuery,
  ): Promise<SubscriptionAggregate> {
    this.logger.log(
      `Executing find subscription by id query: ${query.id.value}`,
    );

    // 01: Assert that the subscription exists
    return await this.assertSubscriptionExsistsService.execute(query.id.value);
  }
}
