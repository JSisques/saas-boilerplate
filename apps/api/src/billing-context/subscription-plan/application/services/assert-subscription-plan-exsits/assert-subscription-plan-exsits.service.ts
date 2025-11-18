import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSubscriptionPlanExsistsService
  implements IBaseService<string, SubscriptionPlanAggregate>
{
  private readonly logger = new Logger(
    AssertSubscriptionPlanExsistsService.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionPlanWriteRepository: SubscriptionPlanWriteRepository,
  ) {}

  /**
   * Asserts that a subscription plan exists by id.
   *
   * @param id - The id of the subscription plan to assert.
   * @returns The subscription plan aggregate.
   */
  async execute(id: string): Promise<SubscriptionPlanAggregate> {
    this.logger.log(`Asserting subscription plan exists by id: ${id}`);

    // 01: Find the subscription plan by id
    const existingSubscriptionPlan =
      await this.subscriptionPlanWriteRepository.findById(id);

    // 02: If the subscription plan does not exist, throw an error
    if (!existingSubscriptionPlan) {
      this.logger.error(`Subscription plan not found by id: ${id}`);
      throw new SubscriptionPlanNotFoundException(id);
    }

    return existingSubscriptionPlan;
  }
}
