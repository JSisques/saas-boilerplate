import { SubscriptionCancelCommand } from '@/billing-context/subscription/application/commands/subscription-cancel/subscription-cancel.command';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionCancelCommand)
export class SubscriptionCancelCommandHandler
  implements ICommandHandler<SubscriptionCancelCommand>
{
  private readonly logger = new Logger(SubscriptionCancelCommandHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
  ) {}

  /**
   * Executes the subscription cancel command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SubscriptionCancelCommand): Promise<void> {
    this.logger.log(
      `Executing cancel subscription command by id: ${command.id}`,
    );

    // 01: Check if the subscription exists
    const existingSubscription =
      await this.assertSubscriptionExsistsService.execute(command.id.value);

    // 02: Cancel the subscription
    await existingSubscription.cancel();

    // 04: Cancel the subscription from the repository
    await this.subscriptionWriteRepository.save(existingSubscription);

    // 05: Publish the subscription cancelled event
    await this.eventBus.publishAll(existingSubscription.getUncommittedEvents());
    await existingSubscription.commit();
  }
}
