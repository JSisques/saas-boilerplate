import { SubscriptionDeactivateCommand } from '@/billing-context/subscription/application/commands/subscription-deactivate/subscription-deactivate.command';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionDeactivateCommand)
export class SubscriptionDeactivateCommandHandler
  implements ICommandHandler<SubscriptionDeactivateCommand>
{
  private readonly logger = new Logger(
    SubscriptionDeactivateCommandHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
  ) {}

  /**
   * Executes the subscription deactivate command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SubscriptionDeactivateCommand): Promise<void> {
    this.logger.log(
      `Executing deactivate subscription command by id: ${command.id}`,
    );

    // 01: Check if the subscription exists
    const existingSubscription =
      await this.assertSubscriptionExsistsService.execute(command.id.value);

    // 02: Deactivate the subscription
    await existingSubscription.deactivate();

    // 04: Deactivate the subscription from the repository
    await this.subscriptionWriteRepository.save(existingSubscription);

    // 05: Publish the subscription deactivated event
    await this.eventBus.publishAll(existingSubscription.getUncommittedEvents());
    await existingSubscription.commit();
  }
}
