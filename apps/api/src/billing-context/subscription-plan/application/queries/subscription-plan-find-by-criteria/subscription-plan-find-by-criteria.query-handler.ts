import {
  SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
  SubscriptionPlanReadRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionPlansByCriteriaQuery } from './subscription-plan-find-by-criteria.query';

@QueryHandler(FindSubscriptionPlansByCriteriaQuery)
export class FindSubscriptionPlansByCriteriaQueryHandler
  implements IQueryHandler<FindSubscriptionPlansByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionPlansByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN)
    private readonly subscriptionPlanReadRepository: SubscriptionPlanReadRepository,
  ) {}

  /**
   * Executes the FindSubscriptionPlansByCriteriaQuery query.
   *
   * @param query - The FindSubscriptionPlansByCriteriaQuery query to execute.
   * @returns The PaginatedResult of SubscriptionPlanViewModels.
   */
  async execute(
    query: FindSubscriptionPlansByCriteriaQuery,
  ): Promise<PaginatedResult<SubscriptionPlanViewModel>> {
    this.logger.log(
      `Executing find subscription plans by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the subscription plans by criteria
    return this.subscriptionPlanReadRepository.findByCriteria(query.criteria);
  }
}
