import { SubscriptionViewModelFactory } from '@/billing-context/subscription/domain/factories/subscription-plan-view-model/subscription-view-model.factory';
import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionCreatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-created/subscription-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionCreatedEvent)
export class SubscriptionCreatedEventHandler
  implements IEventHandler<SubscriptionCreatedEvent>
{
  private readonly logger = new Logger(SubscriptionCreatedEventHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
    private readonly subscriptionViewModelFactory: SubscriptionViewModelFactory,
  ) {}

  /**
   * Handles the SubscriptionCreatedEvent event by creating a new subscription view model.
   *
   * @param event - The SubscriptionCreatedEvent event to handle.
   */
  async handle(event: SubscriptionCreatedEvent) {
    this.logger.log(
      `Handling subscription created event: ${event.aggregateId}`,
    );

    // 01: Create the subscription view model
    const subscriptionCreatedViewModel =
      this.subscriptionViewModelFactory.fromPrimitives(event.data);

    // 02: Save the subscription view model
    await this.subscriptionReadRepository.save(subscriptionCreatedViewModel);
  }
}
