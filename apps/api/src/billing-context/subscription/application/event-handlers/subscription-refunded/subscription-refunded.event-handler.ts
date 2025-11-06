import { AssertSubscriptionViewModelExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-view-model-exsits/assert-subscription-view-model-exsits.service';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionRefundedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-refunded/subscription-refunded.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionRefundedEvent)
export class SubscriptionRefundedEventHandler
  implements IEventHandler<SubscriptionRefundedEvent>
{
  private readonly logger = new Logger(SubscriptionRefundedEventHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
    private readonly assertSubscriptionViewModelExsistsService: AssertSubscriptionViewModelExsistsService,
  ) {}

  /**
   * Handles the SubscriptionRefundedEvent event by updating the existing subscription view model.
   *
   * @param event - The SubscriptionRefundedEvent event to handle.
   */
  async handle(event: SubscriptionRefundedEvent) {
    this.logger.log(
      `Handling subscription refunded event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription view model exists
    const existingSubscriptionViewModel =
      await this.assertSubscriptionViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingSubscriptionViewModel.update({
      status: SubscriptionStatusEnum.REFUNDED,
    });

    // 03: Save the updated subscription view model
    await this.subscriptionReadRepository.save(existingSubscriptionViewModel);
  }
}
