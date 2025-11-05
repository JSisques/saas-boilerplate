import { SubscriptionPlanUpdateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command';
import { SubscriptionUpdateCommand } from '@/billing-context/subscription/application/commands/subscription-update/subscription-update.command';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import { ISubscriptionUpdateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-update/subscription-update.dto';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionUpdateCommand)
export class SubscriptionUpdateCommandHandler
  extends BaseUpdateCommandHandler<
    SubscriptionUpdateCommand,
    ISubscriptionUpdateDto
  >
  implements ICommandHandler<SubscriptionUpdateCommand>
{
  protected readonly logger = new Logger(SubscriptionUpdateCommandHandler.name);

  constructor(
    private readonly assertSubscriptionExsistsService: AssertSubscriptionExsistsService,
    private readonly eventBus: EventBus,
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update subscription command
   *
   * @param command - The command to execute
   */
  async execute(command: SubscriptionPlanUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update subscription command by id: ${command.id}`,
    );

    // 01: Check if the subscription exists
    const existingSubscription =
      await this.assertSubscriptionExsistsService.execute(command.id.value);

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the subscription
    existingSubscription.update(updateData);

    // 04: Save the subscription
    await this.subscriptionWriteRepository.save(existingSubscription);

    // 05: Publish the subscription updated event
    await this.eventBus.publishAll(existingSubscription.getUncommittedEvents());
    await existingSubscription.commit();
  }
}
