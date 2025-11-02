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
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

/**
 * Data Transfer Object for creating a subscription plan.
 *
 * @interface ISubscriptionPlanCreateDto
 * @property {SubscriptionPlanUuidValueObject} id - The immutable identifier of the subscription plan.
 * @property {SubscriptionPlanNameValueObject} name - The name of the subscription plan.
 * @property {SubscriptionPlanSlugValueObject} slug - The slug of the subscription plan.
 * @property {SubscriptionPlanDescriptionValueObject | null} description - The description of the subscription plan.
 * @property {SubscriptionPlanPriceMonthlyValueObject} priceMonthly - The price of the subscription plan.
 * @property {SubscriptionPlanPriceYearlyValueObject} priceYearly - The price of the subscription plan.
 * @property {SubscriptionPlanCurrencyValueObject} currency - The currency of the subscription plan.
 * @property {SubscriptionPlanIntervalValueObject} interval - The interval of the subscription plan.
 * @property {SubscriptionPlanIntervalCountValueObject} intervalCount - The interval count of the subscription plan.
 * @property {SubscriptionPlanTrialPeriodDaysValueObject | null} trialPeriodDays - The trial period days of the subscription plan.
 * @property {SubscriptionPlanIsActiveValueObject} isActive - The is active of the subscription plan.
 * @property {SubscriptionPlanFeaturesValueObject | null} features - The features of the subscription plan.
 * @property {SubscriptionPlanLimitsValueObject | null} limits - The limits of the subscription plan.
 * @property {SubscriptionPlanStripePriceIdValueObject | null} stripePriceId - The stripe price id of the subscription plan.
 */
export interface ISubscriptionPlanCreateDto {
  id: SubscriptionPlanUuidValueObject;
  name: SubscriptionPlanNameValueObject;
  slug: SubscriptionPlanSlugValueObject;
  type: SubscriptionPlanTypeValueObject;
  description: SubscriptionPlanDescriptionValueObject | null;
  priceMonthly: SubscriptionPlanPriceMonthlyValueObject;
  priceYearly: SubscriptionPlanPriceYearlyValueObject;
  currency: SubscriptionPlanCurrencyValueObject;
  interval: SubscriptionPlanIntervalValueObject;
  intervalCount: SubscriptionPlanIntervalCountValueObject;
  trialPeriodDays: SubscriptionPlanTrialPeriodDaysValueObject | null;
  isActive: SubscriptionPlanIsActiveValueObject;
  features: SubscriptionPlanFeaturesValueObject | null;
  limits: SubscriptionPlanLimitsValueObject | null;
  stripePriceId: SubscriptionPlanStripePriceIdValueObject | null;
}
