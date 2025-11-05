import { SubscriptionDeleteCommand } from '@/billing-context/subscription/application/commands/subscription-delete/subscription-delete.command';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionDeleteCommand)
export class SubscriptionDeleteCommandHandler
  implements ICommandHandler<SubscriptionDeleteCommand>
{
  private readonly logger = new Logger(SubscriptionDeleteCommandHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
  ) {}

  /**
   * Executes the subscription delete command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SubscriptionDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing delete subscription command by id: ${command.id}`,
    );

    // 01: Check if the subscription exists
    const existingSubscription =
      await this.assertSubscriptionExsistsService.execute(command.id.value);

    // 02: Delete the subscription
    await existingSubscription.delete();

    // 04: Delete the subscription from the repository
    await this.subscriptionWriteRepository.delete(
      existingSubscription.id.value,
    );

    // 05: Publish the subscription deleted event
    await this.eventBus.publishAll(existingSubscription.getUncommittedEvents());
    await existingSubscription.commit();
  }
}
