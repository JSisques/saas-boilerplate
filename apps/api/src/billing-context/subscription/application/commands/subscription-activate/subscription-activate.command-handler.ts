import { SubscriptionActivateCommand } from '@/billing-context/subscription/application/commands/subscription-activate/subscription-activate.command';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionActivateCommand)
export class SubscriptionActivateCommandHandler
  implements ICommandHandler<SubscriptionActivateCommand>
{
  private readonly logger = new Logger(SubscriptionActivateCommandHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
  ) {}

  /**
   * Executes the subscription activate command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SubscriptionActivateCommand): Promise<void> {
    this.logger.log(
      `Executing activate subscription command by id: ${command.id}`,
    );

    // 01: Check if the subscription exists
    const existingSubscription =
      await this.assertSubscriptionExsistsService.execute(command.id.value);

    // 02: Activate the subscription
    await existingSubscription.activate();

    // 04: Activate the subscription from the repository
    await this.subscriptionWriteRepository.save(existingSubscription);

    // 05: Publish the subscription activated event
    await this.eventBus.publishAll(existingSubscription.getUncommittedEvents());
    await existingSubscription.commit();
  }
}
