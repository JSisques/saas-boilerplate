import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import {
  SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
  SubscriptionPlanReadRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSubscriptionPlanViewModelExsistsService
  implements IBaseService<string, SubscriptionPlanViewModel>
{
  private readonly logger = new Logger(
    AssertSubscriptionPlanViewModelExsistsService.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN)
    private readonly subscriptionPlanReadRepository: SubscriptionPlanReadRepository,
  ) {}

  /**
   * Asserts that a subscription plan view model exists by id.
   *
   * @param id - The id of the subscription plan view model to assert.
   * @returns The subscription plan view model.
   * @throws SubscriptionPlanNotFoundException if the subscription plan view model does not exist.
   */
  async execute(id: string): Promise<SubscriptionPlanViewModel> {
    this.logger.log(
      `Asserting subscription plan view model exists by id: ${id}`,
    );

    // 01: Find the subscription plan by id
    const existingSubscriptionPlanViewModel =
      await this.subscriptionPlanReadRepository.findById(id);

    // 02: If the subscription plan view model does not exist, throw an error
    if (!existingSubscriptionPlanViewModel) {
      this.logger.error(`Subscription plan view model not found by id: ${id}`);
      throw new SubscriptionPlanNotFoundException(id);
    }

    return existingSubscriptionPlanViewModel;
  }
}
