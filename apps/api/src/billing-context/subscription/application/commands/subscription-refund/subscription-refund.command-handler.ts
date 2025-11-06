import { SubscriptionRefundCommand } from '@/billing-context/subscription/application/commands/subscription-refund/subscription-refund.command';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionRefundCommand)
export class SubscriptionRefundCommandHandler
  implements ICommandHandler<SubscriptionRefundCommand>
{
  private readonly logger = new Logger(SubscriptionRefundCommandHandler.name);

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
  ) {}

  /**
   * Executes the subscription refund command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: SubscriptionRefundCommand): Promise<void> {
    this.logger.log(
      `Executing refund subscription command by id: ${command.id}`,
    );

    // 01: Check if the subscription exists
    const existingSubscription =
      await this.assertSubscriptionExsistsService.execute(command.id.value);

    // 02: Refund the subscription
    await existingSubscription.refund();

    // 04: Refund the subscription from the repository
    await this.subscriptionWriteRepository.save(existingSubscription);

    // 05: Publish the subscription refunded event
    await this.eventBus.publishAll(existingSubscription.getUncommittedEvents());
    await existingSubscription.commit();
  }
}
