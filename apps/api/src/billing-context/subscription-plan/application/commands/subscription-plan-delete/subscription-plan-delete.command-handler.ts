import { SubscriptionPlanDeleteCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-delete/subscription-plan-delete.command';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionPlanDeleteCommand)
export class SubscriptionPlanDeleteCommandHandler
  implements ICommandHandler<SubscriptionPlanDeleteCommand>
{
  private readonly logger = new Logger(
    SubscriptionPlanDeleteCommandHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionPlanWriteRepository: SubscriptionPlanWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSubscriptionPlanExsistsService: AssertSubscriptionPlanExsistsService,
  ) {}

  /**
   * Executes the subscription plan delete command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SubscriptionPlanDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing delete subscription plan command by id: ${command.id}`,
    );

    // 01: Check if the subscription plan exists
    const existingSubscriptionPlan =
      await this.assertSubscriptionPlanExsistsService.execute(command.id.value);

    // 02: Delete the subscription plan
    await existingSubscriptionPlan.delete();

    // 04: Delete the subscription plan from the repository
    await this.subscriptionPlanWriteRepository.delete(
      existingSubscriptionPlan.id.value,
    );

    // 05: Publish the subscription plan deleted event
    await this.eventBus.publishAll(
      existingSubscriptionPlan.getUncommittedEvents(),
    );
    await existingSubscriptionPlan.commit();
  }
}
