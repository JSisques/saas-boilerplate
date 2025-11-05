import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionsByCriteriaQuery } from './subscription-find-by-criteria.query';

@QueryHandler(FindSubscriptionsByCriteriaQuery)
export class FindSubscriptionsByCriteriaQueryHandler
  implements IQueryHandler<FindSubscriptionsByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionsByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
  ) {}

  /**
   * Executes the FindSubscriptionsByCriteriaQuery query.
   *
   * @param query - The FindSubscriptionsByCriteriaQuery query to execute.
   * @returns The PaginatedResult of SubscriptionViewModels.
   */
  async execute(
    query: FindSubscriptionsByCriteriaQuery,
  ): Promise<PaginatedResult<SubscriptionViewModel>> {
    this.logger.log(
      `Executing find subscriptions by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the subscriptions by criteria
    return this.subscriptionReadRepository.findByCriteria(query.criteria);
  }
}
