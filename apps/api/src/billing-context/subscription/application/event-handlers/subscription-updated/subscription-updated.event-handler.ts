import { AssertSubscriptionViewModelExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-view-model-exsits/assert-subscription-view-model-exsits.service';
import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionUpdatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-updated/subscription-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionUpdatedEvent)
export class SubscriptionUpdatedEventHandler
  implements IEventHandler<SubscriptionUpdatedEvent>
{
  private readonly logger = new Logger(SubscriptionUpdatedEventHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
    private readonly assertSubscriptionViewModelExsistsService: AssertSubscriptionViewModelExsistsService,
  ) {}

  /**
   * Handles the SubscriptionUpdatedEvent event by updating the existing subscription view model.
   *
   * @param event - The SubscriptionUpdatedEvent event to handle.
   */
  async handle(event: SubscriptionUpdatedEvent) {
    this.logger.log(
      `Handling subscription updated event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription view model exists
    const existingSubscriptionViewModel =
      await this.assertSubscriptionViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingSubscriptionViewModel.update(event.data);

    // 03: Save the updated subscription view model
    await this.subscriptionReadRepository.save(existingSubscriptionViewModel);
  }
}
