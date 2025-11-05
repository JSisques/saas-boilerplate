import { AssertSubscriptionViewModelExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-view-model-exsits/assert-subscription-view-model-exsits.service';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionViewModelByIdQuery } from './subscription-find-view-model-by-id.query';

@QueryHandler(FindSubscriptionViewModelByIdQuery)
export class FindSubscriptionViewModelByIdQueryHandler
  implements IQueryHandler<FindSubscriptionViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertSubscriptionViewModelExsistsService: AssertSubscriptionViewModelExsistsService,
  ) {}

  /**
   * Executes the FindSubscriptionViewModelByIdQuery query.
   *
   * @param query - The FindSubscriptionViewModelByIdQuery query to execute.
   * @returns The SubscriptionViewModel if found, null otherwise.
   */
  async execute(
    query: FindSubscriptionViewModelByIdQuery,
  ): Promise<SubscriptionViewModel> {
    this.logger.log(
      `Executing find subscription view model by id query: ${query.id.value}`,
    );

    // 01: Assert that the subscription view model exists
    return await this.assertSubscriptionViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
