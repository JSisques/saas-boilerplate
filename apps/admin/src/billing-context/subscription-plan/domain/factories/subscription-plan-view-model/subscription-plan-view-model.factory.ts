import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';
import { SubscriptionPlanPrimitives } from '@/billing-context/subscription-plan/domain/primitives/subscription-plan.primitives';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { IReadFactory } from '@repo/shared/domain/interfaces/read-factory.interface';

/**
 * This factory class is used to create a new subscription plan view model.
 */
export class SubscriptionPlanViewModelFactory
  implements
    IReadFactory<
      SubscriptionPlanViewModel,
      ISubscriptionPlanCreateViewModelDto,
      SubscriptionPlanAggregate,
      SubscriptionPlanPrimitives
    >
{
  /**
   * Creates a new subscription plan view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(
    data: ISubscriptionPlanCreateViewModelDto,
  ): SubscriptionPlanViewModel {
    return new SubscriptionPlanViewModel(data);
  }

  /**
   * Creates a new subscription plan view model from a subscription plan primitive.
   *
   * @param subscriptionPlanPrimitives - The subscription plan primitive to create the view model from.
   * @returns The subscription plan view model.
   */
  fromPrimitives(
    subscriptionPlanPrimitives: SubscriptionPlanPrimitives,
  ): SubscriptionPlanViewModel {
    const now = new Date();

    return new SubscriptionPlanViewModel({
      id: subscriptionPlanPrimitives.id,
      name: subscriptionPlanPrimitives.name,
      slug: subscriptionPlanPrimitives.slug,
      type: subscriptionPlanPrimitives.type,
      description: subscriptionPlanPrimitives.description,
      priceMonthly: subscriptionPlanPrimitives.priceMonthly,
      priceYearly: subscriptionPlanPrimitives.priceYearly,
      currency: subscriptionPlanPrimitives.currency,
      interval: subscriptionPlanPrimitives.interval,
      intervalCount: subscriptionPlanPrimitives.intervalCount,
      trialPeriodDays: subscriptionPlanPrimitives.trialPeriodDays,
      isActive: subscriptionPlanPrimitives.isActive,
      features: subscriptionPlanPrimitives.features,
      limits: subscriptionPlanPrimitives.limits,
      stripePriceId: subscriptionPlanPrimitives.stripePriceId,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a new subscription plan view model from a subscription plan aggregate.
   *
   * @param subscriptionPlanAggregate - The subscription plan aggregate to create the view model from.
   * @returns The subscription plan view model.
   */
  fromAggregate(
    subscriptionPlanAggregate: SubscriptionPlanAggregate,
  ): SubscriptionPlanViewModel {
    const now = new Date();

    return new SubscriptionPlanViewModel({
      id: subscriptionPlanAggregate.id.value,
      name: subscriptionPlanAggregate.name.value,
      slug: subscriptionPlanAggregate.slug.value,
      type: subscriptionPlanAggregate.type.value,
      description: subscriptionPlanAggregate.description?.value || null,
      priceMonthly: subscriptionPlanAggregate.priceMonthly.value,
      priceYearly: subscriptionPlanAggregate.priceYearly.value,
      currency: subscriptionPlanAggregate.currency.value,
      interval: subscriptionPlanAggregate.interval.value,
      intervalCount: subscriptionPlanAggregate.intervalCount.value,
      trialPeriodDays: subscriptionPlanAggregate.trialPeriodDays?.value || null,
      isActive: subscriptionPlanAggregate.isActive.value,
      features: subscriptionPlanAggregate.features?.value || null,
      limits: subscriptionPlanAggregate.limits?.value || null,
      stripePriceId: subscriptionPlanAggregate.stripePriceId?.value || null,
      createdAt: now,
      updatedAt: now,
    });
  }
}
