import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionPlanViewModelByIdQuery } from './subscription-plan-find-view-model-by-id.query';

@QueryHandler(FindSubscriptionPlanViewModelByIdQuery)
export class FindSubscriptionPlanViewModelByIdQueryHandler
  implements IQueryHandler<FindSubscriptionPlanViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionPlanViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertSubscriptionPlanViewModelExsistsService: AssertSubscriptionPlanViewModelExsistsService,
  ) {}

  /**
   * Executes the FindSubscriptionPlanViewModelByIdQuery query.
   *
   * @param query - The FindSubscriptionPlanViewModelByIdQuery query to execute.
   * @returns The SubscriptionPlanViewModel if found, null otherwise.
   */
  async execute(
    query: FindSubscriptionPlanViewModelByIdQuery,
  ): Promise<SubscriptionPlanViewModel> {
    this.logger.log(
      `Executing find subscription plan view model by id query: ${query.id.value}`,
    );

    // 01: Assert that the subscription plan view model exists
    return await this.assertSubscriptionPlanViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
