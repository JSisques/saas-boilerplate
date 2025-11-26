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
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanStripePriceIdValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo';
import { SubscriptionPlanTrialPeriodDaysValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating SubscriptionPlanAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate user information.
 */
@Injectable()
export class SubscriptionPlanAggregateFactory
  implements
    IWriteFactory<SubscriptionPlanAggregate, ISubscriptionPlanCreateDto>
{
  /**
   * Creates a new SubscriptionPlanAggregate entity using the provided properties.
   *
   * @param data - The subscription plan create data.
   * @param data.id - The subscription plan id.
   * @param data.name - The subscription plan name.
   * @param data.slug - The subscription plan slug.
   * @param data.description - The subscription plan description.
   * @param data.priceMonthly - The subscription plan price monthly.
   * @param data.priceYearly - The subscription plan price yearly.
   * @param data.currency - The subscription plan currency.
   * @param data.interval - The subscription plan interval.
   * @param data.intervalCount - The subscription plan interval count.
   * @param data.trialPeriodDays - The subscription plan trial period days.
   * @param data.isActive - The subscription plan is active.
   * @param data.features - The subscription plan features.
   * @param data.limits - The subscription plan limits.
   * @param data.stripePriceId - The subscription plan stripe price id.
   * @param data.createdAt - The subscription plan created at.
   * @param data.updatedAt - The subscription plan updated at.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {SubscriptionPlanAggregate} - The created subscription plan aggregate entity.
   */
  public create(
    data: ISubscriptionPlanCreateDto,
    generateEvent: boolean = true,
  ): SubscriptionPlanAggregate {
    return new SubscriptionPlanAggregate(data, generateEvent);
  }

  /**
   * Creates a new SubscriptionPlanAggregate entity from primitive data.
   *
   * @param data - The subscription plan primitive data.
   * @param data.id - The subscription plan id.
   * @param data.name - The subscription plan name.
   * @param data.slug - The subscription plan slug.
   * @param data.description - The subscription plan description.
   * @param data.priceMonthly - The subscription plan price monthly.
   * @param data.priceYearly - The subscription plan price yearly.
   * @param data.currency - The subscription plan currency.
   * @param data.interval - The subscription plan interval.
   * @param data.intervalCount - The subscription plan interval count.
   * @param data.trialPeriodDays - The subscription plan trial period days.
   * @param data.isActive - The subscription plan is active.
   * @param data.features - The subscription plan features.
   * @param data.limits - The subscription plan limits.
   * @param data.stripePriceId - The subscription plan stripe price id.
   * @param data.createdAt - The subscription plan created at.
   * @param data.updatedAt - The subscription plan updated at.
   * @returns The created subscription plan aggregate entity.
   */
  public fromPrimitives(
    data: SubscriptionPlanPrimitives,
  ): SubscriptionPlanAggregate {
    return new SubscriptionPlanAggregate({
      id: new SubscriptionPlanUuidValueObject(data.id),
      name: data.name ? new UserNameValueObject(data.name) : null,
      slug: data.slug ? new SubscriptionPlanSlugValueObject(data.slug) : null,
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
        ? new SubscriptionPlanFeaturesValueObject(data.features)
        : null,
      limits: data.limits
        ? new SubscriptionPlanLimitsValueObject(data.limits)
        : null,
      stripePriceId: data.stripePriceId
        ? new SubscriptionPlanStripePriceIdValueObject(data.stripePriceId)
        : null,
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
