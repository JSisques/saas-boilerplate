import { SubscriptionNotFoundException } from '@/billing-context/subscription/application/exceptions/subscription-not-found/subscription-not-found.exception';
import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSubscriptionExsistsService
  implements IBaseService<string, SubscriptionAggregate>
{
  private readonly logger = new Logger(AssertSubscriptionExsistsService.name);

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
  ) {}

  /**
   * Asserts that a subscription exists by id.
   *
   * @param id - The id of the subscription to assert.
   * @returns The subscription aggregate.
   */
  async execute(id: string): Promise<SubscriptionAggregate> {
    this.logger.log(`Asserting subscription exists by id: ${id}`);

    // 01: Find the subscription by id
    const existingSubscription =
      await this.subscriptionWriteRepository.findById(id);

    // 02: If the subscription does not exist, throw an error
    if (!existingSubscription) {
      this.logger.error(`Subscription not found by id: ${id}`);
      throw new SubscriptionNotFoundException(id);
    }

    return existingSubscription;
  }
}
