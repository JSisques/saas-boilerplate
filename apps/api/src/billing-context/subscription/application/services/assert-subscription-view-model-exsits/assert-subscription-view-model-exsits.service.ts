import { SubscriptionNotFoundException } from '@/billing-context/subscription/application/exceptions/subscription-not-found/subscription-not-found.exception';
import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSubscriptionViewModelExsistsService
  implements IBaseService<string, SubscriptionViewModel>
{
  private readonly logger = new Logger(
    AssertSubscriptionViewModelExsistsService.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
  ) {}

  /**
   * Asserts that a subscription view model exists by id.
   *
   * @param id - The id of the subscription view model to assert.
   * @returns The subscription view model.
   * @throws SubscriptionNotFoundException if the subscription view model does not exist.
   */
  async execute(id: string): Promise<SubscriptionViewModel> {
    this.logger.log(`Asserting subscription view model exists by id: ${id}`);

    // 01: Find the subscription by id
    const existingSubscriptionViewModel =
      await this.subscriptionReadRepository.findById(id);

    // 02: If the subscription view model does not exist, throw an error
    if (!existingSubscriptionViewModel) {
      this.logger.error(`Subscription view model not found by id: ${id}`);
      throw new SubscriptionNotFoundException(id);
    }

    return existingSubscriptionViewModel;
  }
}
