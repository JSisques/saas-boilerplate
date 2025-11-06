import { AssertSubscriptionViewModelExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-view-model-exsits/assert-subscription-view-model-exsits.service';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionDeactivatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-deactivated/subscription-deactivated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionDeactivatedEvent)
export class SubscriptionDeactivatedEventHandler
  implements IEventHandler<SubscriptionDeactivatedEvent>
{
  private readonly logger = new Logger(
    SubscriptionDeactivatedEventHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
    private readonly assertSubscriptionViewModelExsistsService: AssertSubscriptionViewModelExsistsService,
  ) {}

  /**
   * Handles the SubscriptionDeactivatedEvent event by updating the existing subscription view model.
   *
   * @param event - The SubscriptionDeactivatedEvent event to handle.
   */
  async handle(event: SubscriptionDeactivatedEvent) {
    this.logger.log(
      `Handling subscription deactivated event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription view model exists
    const existingSubscriptionViewModel =
      await this.assertSubscriptionViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingSubscriptionViewModel.update({
      status: SubscriptionStatusEnum.INACTIVE,
    });

    // 03: Save the updated subscription view model
    await this.subscriptionReadRepository.save(existingSubscriptionViewModel);
  }
}
