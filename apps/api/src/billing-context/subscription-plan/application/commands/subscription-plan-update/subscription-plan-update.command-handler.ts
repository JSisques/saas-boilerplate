import { SubscriptionPlanUpdateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import { AssertSubscriptionPlanSlugIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-slug-is-unique/assert-subscription-plan-slug-is-unique.service';
import { AssertSubscriptionPlanTypeIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-type-is-unique/assert-subscription-plan-type-is-unique.service';
import { ISubscriptionPlanUpdateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-update/subscription-plan-update.dto';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { IBaseCommandHandler } from '@/shared/application/commands/interfaces/base-command-handler.interface';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(SubscriptionPlanUpdateCommand)
export class SubscriptionPlanUpdateCommandHandler
  extends BaseUpdateCommandHandler<
    SubscriptionPlanUpdateCommand,
    ISubscriptionPlanUpdateDto
  >
  implements
    ICommandHandler<SubscriptionPlanUpdateCommand>,
    IBaseCommandHandler<SubscriptionPlanUpdateCommand>
{
  protected readonly logger = new Logger(
    SubscriptionPlanUpdateCommandHandler.name,
  );

  constructor(
    private readonly assertSubscriptionPlanExsistsService: AssertSubscriptionPlanExsistsService,
    private readonly assertSubscriptionPlanSlugIsUniqueService: AssertSubscriptionPlanSlugIsUniqueService,
    private readonly assertSubscriptionPlanTypeIsUniqueService: AssertSubscriptionPlanTypeIsUniqueService,
    private readonly eventBus: EventBus,
    @Inject(SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionPlanWriteRepository: SubscriptionPlanWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update subscription plan command
   *
   * @param command - The command to execute
   */
  async execute(command: SubscriptionPlanUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update subscription plan command by id: ${command.id}`,
    );

    // 01: Check if the subscription plan exists
    const existingSubscriptionPlan =
      await this.assertSubscriptionPlanExsistsService.execute(command.id.value);

    // 02: Execute asserts
    await this.executeAsserts(command);

    // 03: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 04: Update the subscription plan
    existingSubscriptionPlan.update(updateData);

    // 05: Save the subscription plan
    await this.subscriptionPlanWriteRepository.save(existingSubscriptionPlan);

    // 06: Publish the subscription plan updated event
    await this.eventBus.publishAll(
      existingSubscriptionPlan.getUncommittedEvents(),
    );
    await existingSubscriptionPlan.commit();
  }

  /**
   * Executes the asserts for the subscription plan update command
   *
   * @param command - The command to execute
   * @returns The asserts results
   */
  async executeAsserts(
    command: SubscriptionPlanUpdateCommand,
  ): Promise<void[]> {
    const promises = [
      this.assertSubscriptionPlanSlugIsUniqueService.execute(
        command.slug?.value,
      ),
      this.assertSubscriptionPlanTypeIsUniqueService.execute(
        command.type?.value as SubscriptionPlanTypeEnum,
      ),
    ];
    return Promise.all(promises);
  }
}
