import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionPlanByIdQuery } from './subscription-plan-find-by-id.query';

@QueryHandler(FindSubscriptionPlanByIdQuery)
export class FindSubscriptionPlanByIdQueryHandler
  implements IQueryHandler<FindSubscriptionPlanByIdQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionPlanByIdQueryHandler.name,
  );

  constructor(
    private readonly assertSubscriptionPlanExsistsService: AssertSubscriptionPlanExsistsService,
  ) {}

  /**
   * Executes the FindSubscriptionPlanByIdQuery query.
   *
   * @param query - The FindSubscriptionPlanByIdQuery query to execute.
   * @returns The SubscriptionPlanAggregate if found, null otherwise.
   */
  async execute(
    query: FindSubscriptionPlanByIdQuery,
  ): Promise<SubscriptionPlanAggregate> {
    this.logger.log(
      `Executing find subscription plan by id query: ${query.id.value}`,
    );

    // 01: Assert that the subscription plan exists
    return await this.assertSubscriptionPlanExsistsService.execute(
      query.id.value,
    );
  }
}
