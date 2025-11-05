import { AssertSubscriptionTenantIdNotExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-tenant-id-not-exsists/assert-subscription-tenant-id-not-exsists.service';
import { SubscriptionAggregateFactory } from '@/billing-context/subscription/domain/factories/subscription-aggregate/subscription-aggregate.factory';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionCreateCommand } from './subscription-create.command';

@CommandHandler(SubscriptionCreateCommand)
export class SubscriptionCreateCommandHandler
  implements ICommandHandler<SubscriptionCreateCommand>
{
  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
    private readonly eventBus: EventBus,
    private readonly subscriptionAggregateFactory: SubscriptionAggregateFactory,
    private readonly assertSubscriptionTenantIdNotExsistsService: AssertSubscriptionTenantIdNotExsistsService,
  ) {}

  /**
   * Executes the subscription create command
   *
   * @param command - The command to execute
   * @returns The created subscription id
   */
  async execute(command: SubscriptionCreateCommand): Promise<string> {
    // 01: Assert the subscription tenant id not exists
    await this.assertSubscriptionTenantIdNotExsistsService.execute(
      command.tenantId.value,
    );

    // 02: Create the subscription entity
    const subscription = this.subscriptionAggregateFactory.create({
      ...command,
    });

    // 03: Save the subscription entity
    await this.subscriptionWriteRepository.save(subscription);

    // 04: Publish all events
    await this.eventBus.publishAll(subscription.getUncommittedEvents());
    await subscription.commit();

    // 05: Return the subscription id
    return subscription.id.value;
  }
}
