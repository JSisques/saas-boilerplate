import { SubscriptionPlanCreateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-create/subscription-plan-create.command';
import { AssertSubscriptionPlanSlugIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-slug-is-unique/assert-subscription-plan-slug-is-unique.service';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionPlanCreateCommand)
export class SubscriptionPlanCreateCommandHandler
  implements ICommandHandler<SubscriptionPlanCreateCommand>
{
  constructor(
    @Inject(SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionPlanWriteRepository: SubscriptionPlanWriteRepository,
    private readonly eventBus: EventBus,
    private readonly subscriptionPlanAggregateFactory: SubscriptionPlanAggregateFactory,
    private readonly assertSubscriptionPlanSlugIsUniqueService: AssertSubscriptionPlanSlugIsUniqueService,
  ) {}

  /**
   * Executes the subscription plan create command
   *
   * @param command - The command to execute
   * @returns The created subscription plan id
   */
  async execute(command: SubscriptionPlanCreateCommand): Promise<string> {
    // 01: Assert the subscription plan slug is unique
    await this.assertSubscriptionPlanSlugIsUniqueService.execute(
      command.slug.value,
    );

    // 02: Create the subscription plan entity
    const subscriptionPlan = this.subscriptionPlanAggregateFactory.create({
      ...command,
    });

    // 03: Save the subscription plan entity
    await this.subscriptionPlanWriteRepository.save(subscriptionPlan);

    // 04: Publish all events
    await this.eventBus.publishAll(subscriptionPlan.getUncommittedEvents());
    await subscriptionPlan.commit();

    // 05: Return the subscription plan id
    return subscriptionPlan.id.value;
  }
}
