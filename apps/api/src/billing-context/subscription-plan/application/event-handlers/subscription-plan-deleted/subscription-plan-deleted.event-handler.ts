import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import {
  SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
  SubscriptionPlanReadRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubscriptionPlanDeletedEvent)
export class SubscriptionPlanDeletedEventHandler
  implements IEventHandler<SubscriptionPlanDeletedEvent>
{
  private readonly logger = new Logger(
    SubscriptionPlanDeletedEventHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN)
    private readonly subscriptionPlanReadRepository: SubscriptionPlanReadRepository,
    private readonly assertSubscriptionPlanViewModelExsistsService: AssertSubscriptionPlanViewModelExsistsService,
  ) {}

  /**
   * Handles the SubscriptionPlanDeletedEvent event by deleting the existing subscription plan view model.
   *
   * @param event - The SubscriptionPlanDeletedEvent event to handle.
   */
  async handle(event: SubscriptionPlanDeletedEvent) {
    this.logger.log(
      `Handling subscription plan deleted event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription plan view model exists
    const existingSubscriptionPlanViewModel =
      await this.assertSubscriptionPlanViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the subscription plan view model
    await this.subscriptionPlanReadRepository.delete(
      existingSubscriptionPlanViewModel.id,
    );
  }
}
