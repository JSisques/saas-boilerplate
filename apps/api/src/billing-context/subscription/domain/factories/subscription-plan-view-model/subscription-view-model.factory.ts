import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { ISubscriptionCreateViewModelDto } from '@/billing-context/subscription/domain/dtos/view-models/subscription-create-view-model/subscription-create-view-model.dto';
import { SubscriptionPrimitives } from '@/billing-context/subscription/domain/primitives/subscription.primitives';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new subscription view model.
 */
@Injectable()
export class SubscriptionViewModelFactory
  implements
    IReadFactory<
      SubscriptionViewModel,
      ISubscriptionCreateViewModelDto,
      SubscriptionAggregate,
      SubscriptionPrimitives
    >
{
  private readonly logger = new Logger(SubscriptionViewModelFactory.name);

  /**
   * Creates a new subscription view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: ISubscriptionCreateViewModelDto): SubscriptionViewModel {
    this.logger.log(
      `Creating subscription view model from DTO: ${JSON.stringify(data)}`,
    );
    return new SubscriptionViewModel(data);
  }

  /**
   * Creates a new subscription view model from a subscription primitive.
   *
   * @param subscriptionPrimitives - The subscription primitive to create the view model from.
   * @returns The subscription view model.
   */
  fromPrimitives(
    subscriptionPrimitives: SubscriptionPrimitives,
  ): SubscriptionViewModel {
    this.logger.log(
      `Creating subscription view model from primitives: ${subscriptionPrimitives}`,
    );

    const now = new Date();

    return new SubscriptionViewModel({
      id: subscriptionPrimitives.id,
      tenantId: subscriptionPrimitives.tenantId,
      planId: subscriptionPrimitives.planId,
      startDate: subscriptionPrimitives.startDate,
      endDate: subscriptionPrimitives.endDate,
      trialEndDate: subscriptionPrimitives.trialEndDate,
      status: subscriptionPrimitives.status,
      stripeSubscriptionId: subscriptionPrimitives.stripeSubscriptionId,
      stripeCustomerId: subscriptionPrimitives.stripeCustomerId,
      renewalMethod: subscriptionPrimitives.renewalMethod,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Creates a new subscription view model from a subscription aggregate.
   *
   * @param subscriptionAggregate - The subscription aggregate to create the view model from.
   * @returns The subscription view model.
   */
  fromAggregate(
    subscriptionAggregate: SubscriptionAggregate,
  ): SubscriptionViewModel {
    this.logger.log(
      `Creating subscription view model from aggregate: ${subscriptionAggregate}`,
    );

    const now = new Date();

    return new SubscriptionViewModel({
      id: subscriptionAggregate.id.value,
      tenantId: subscriptionAggregate.tenantId.value,
      planId: subscriptionAggregate.planId.value,
      startDate: subscriptionAggregate.startDate.value,
      endDate: subscriptionAggregate.endDate.value,
      trialEndDate: subscriptionAggregate.trialEndDate?.value ?? null,
      status: subscriptionAggregate.status.value,
      stripeSubscriptionId:
        subscriptionAggregate.stripeSubscriptionId?.value ?? null,
      stripeCustomerId: subscriptionAggregate.stripeCustomerId?.value ?? null,
      renewalMethod: subscriptionAggregate.renewalMethod.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
