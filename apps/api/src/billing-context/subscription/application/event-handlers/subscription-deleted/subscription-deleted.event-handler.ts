import { AssertSubscriptionViewModelExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-view-model-exsits/assert-subscription-view-model-exsits.service';
import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionDeletedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-deleted/subscription-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionDeletedEvent)
export class SubscriptionDeletedEventHandler
  implements IEventHandler<SubscriptionDeletedEvent>
{
  private readonly logger = new Logger(SubscriptionDeletedEventHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
    private readonly assertSubscriptionViewModelExsistsService: AssertSubscriptionViewModelExsistsService,
  ) {}

  /**
   * Handles the SubscriptionDeletedEvent event by deleting the existing subscription view model.
   *
   * @param event - The SubscriptionDeletedEvent event to handle.
   */
  async handle(event: SubscriptionDeletedEvent) {
    this.logger.log(
      `Handling subscription deleted event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription view model exists
    const existingSubscriptionViewModel =
      await this.assertSubscriptionViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the subscription view model
    await this.subscriptionReadRepository.delete(
      existingSubscriptionViewModel.id,
    );
  }
}
