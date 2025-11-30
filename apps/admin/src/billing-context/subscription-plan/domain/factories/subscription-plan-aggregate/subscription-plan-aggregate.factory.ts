import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';
import { SubscriptionPlanPrimitives } from '@/billing-context/subscription-plan/domain/primitives/subscription-plan.primitives';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanDescriptionValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-description/subscription-plan-description.vo';
import { SubscriptionPlanFeaturesValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-features/subscription-plan-features.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';
import { SubscriptionPlanLimitsValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-limits/subscription-plan-limits.vo';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanStripePriceIdValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo';
import { SubscriptionPlanTrialPeriodDaysValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { IWriteFactory } from '@repo/shared/domain/interfaces/write-factory.interface';
import { SubscriptionPlanUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

/**
 * Factory class responsible for creating SubscriptionPlanAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate subscription plan information.
 */
export class SubscriptionPlanAggregateFactory
  implements
    IWriteFactory<SubscriptionPlanAggregate, ISubscriptionPlanCreateDto>
{
  /**
   * Creates a new SubscriptionPlanAggregate entity using the provided properties.
   *
   * @param data - The subscription plan create data.
   * @returns {SubscriptionPlanAggregate} - The created subscription plan aggregate entity.
   */
  public create(data: ISubscriptionPlanCreateDto): SubscriptionPlanAggregate {
    return new SubscriptionPlanAggregate(data);
  }

  /**
   * Creates a new SubscriptionPlanAggregate entity from primitive data.
   *
   * @param data - The subscription plan primitive data.
   * @returns The created subscription plan aggregate entity.
   */
  public fromPrimitives(
    data: SubscriptionPlanPrimitives,
  ): SubscriptionPlanAggregate {
    return new SubscriptionPlanAggregate({
      id: new SubscriptionPlanUuidValueObject(data.id),
      name: new SubscriptionPlanNameValueObject(data.name),
      slug: new SubscriptionPlanSlugValueObject(data.slug),
      type: new SubscriptionPlanTypeValueObject(data.type),
      description: data.description
        ? new SubscriptionPlanDescriptionValueObject(data.description)
        : null,
      priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(
        data.priceMonthly,
      ),
      priceYearly: new SubscriptionPlanPriceYearlyValueObject(data.priceYearly),
      currency: new SubscriptionPlanCurrencyValueObject(data.currency),
      interval: new SubscriptionPlanIntervalValueObject(data.interval),
      intervalCount: new SubscriptionPlanIntervalCountValueObject(
        data.intervalCount,
      ),
      trialPeriodDays: data.trialPeriodDays
        ? new SubscriptionPlanTrialPeriodDaysValueObject(data.trialPeriodDays)
        : null,
      isActive: new SubscriptionPlanIsActiveValueObject(data.isActive),
      features: data.features
        ? new SubscriptionPlanFeaturesValueObject(JSON.stringify(data.features))
        : null,
      limits: data.limits
        ? new SubscriptionPlanLimitsValueObject(JSON.stringify(data.limits))
        : null,
      stripePriceId: data.stripePriceId
        ? new SubscriptionPlanStripePriceIdValueObject(data.stripePriceId)
        : null,
    });
  }
}
