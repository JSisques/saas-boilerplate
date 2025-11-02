import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import {
  SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
  SubscriptionPlanReadRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanUpdatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionPlanUpdatedEvent)
export class SubscriptionPlanUpdatedEventHandler
  implements IEventHandler<SubscriptionPlanUpdatedEvent>
{
  private readonly logger = new Logger(
    SubscriptionPlanUpdatedEventHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN)
    private readonly subscriptionPlanReadRepository: SubscriptionPlanReadRepository,
    private readonly assertSubscriptionPlanViewModelExsistsService: AssertSubscriptionPlanViewModelExsistsService,
  ) {}

  /**
   * Handles the SubscriptionPlanUpdatedEvent event by updating the existing subscription plan view model.
   *
   * @param event - The SubscriptionPlanUpdatedEvent event to handle.
   */
  async handle(event: SubscriptionPlanUpdatedEvent) {
    this.logger.log(
      `Handling subscription plan updated event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription plan view model exists
    const existingSubscriptionPlanViewModel =
      await this.assertSubscriptionPlanViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Update the existing view model with new data
    existingSubscriptionPlanViewModel.update(event.data);

    // 03: Save the updated subscription plan view model
    await this.subscriptionPlanReadRepository.save(
      existingSubscriptionPlanViewModel,
    );
  }
}
