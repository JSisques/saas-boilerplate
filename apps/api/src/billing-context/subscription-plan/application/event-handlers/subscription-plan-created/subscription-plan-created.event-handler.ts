import { SubscriptionPlanViewModelFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-view-model/subscription-plan-view-model.factory';
import {
  SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
  SubscriptionPlanReadRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionPlanCreatedEvent)
export class SubscriptionPlanCreatedEventHandler
  implements IEventHandler<SubscriptionPlanCreatedEvent>
{
  private readonly logger = new Logger(
    SubscriptionPlanCreatedEventHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN)
    private readonly subscriptionPlanReadRepository: SubscriptionPlanReadRepository,
    private readonly subscriptionPlanViewModelFactory: SubscriptionPlanViewModelFactory,
  ) {}

  /**
   * Handles the SubscriptionPlanCreatedEvent event by creating a new subscription plan view model.
   *
   * @param event - The SubscriptionPlanCreatedEvent event to handle.
   */
  async handle(event: SubscriptionPlanCreatedEvent) {
    this.logger.log(
      `Handling subscription plan created event: ${event.aggregateId}`,
    );

    // 01: Create the subscription plan view model
    const subscriptionPlanCreatedViewModel =
      this.subscriptionPlanViewModelFactory.fromPrimitives(event.data);

    // 02: Save the subscription plan view model
    await this.subscriptionPlanReadRepository.save(
      subscriptionPlanCreatedViewModel,
    );
  }
}
