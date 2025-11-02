import { ISubscriptionPlanCreateCommandDto } from '@/billing-context/subscription-plan/application/dtos/commands/subscription-plan-create/subscription-plan-create-command.dto';
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

export class SubscriptionPlanCreateCommand {
  readonly id: SubscriptionPlanUuidValueObject;
  readonly name: SubscriptionPlanNameValueObject;
  readonly slug: SubscriptionPlanSlugValueObject;
  readonly type: SubscriptionPlanTypeValueObject;
  readonly description: SubscriptionPlanDescriptionValueObject | null;
  readonly priceMonthly: SubscriptionPlanPriceMonthlyValueObject;
  readonly priceYearly: SubscriptionPlanPriceYearlyValueObject;
  readonly currency: SubscriptionPlanCurrencyValueObject;
  readonly interval: SubscriptionPlanIntervalValueObject;
  readonly intervalCount: SubscriptionPlanIntervalCountValueObject;
  readonly trialPeriodDays: SubscriptionPlanTrialPeriodDaysValueObject | null;
  readonly isActive: SubscriptionPlanIsActiveValueObject;
  readonly features: SubscriptionPlanFeaturesValueObject | null;
  readonly limits: SubscriptionPlanLimitsValueObject | null;
  readonly stripePriceId: SubscriptionPlanStripePriceIdValueObject | null;

  constructor(props: ISubscriptionPlanCreateCommandDto) {
    this.id = new SubscriptionPlanUuidValueObject();
    this.name = new SubscriptionPlanNameValueObject(props.name);
    this.slug = new SubscriptionPlanSlugValueObject(props.name, {
      generateFromString: true,
    });
    this.type = new SubscriptionPlanTypeValueObject(props.type);

    this.description = props.description
      ? new SubscriptionPlanDescriptionValueObject(props.description)
      : null;

    this.priceMonthly = new SubscriptionPlanPriceMonthlyValueObject(
      props.priceMonthly,
    );
    this.priceYearly = new SubscriptionPlanPriceYearlyValueObject(
      props.priceMonthly * 12,
    );
    this.currency = new SubscriptionPlanCurrencyValueObject(props.currency);
    this.interval = new SubscriptionPlanIntervalValueObject(props.interval);
    this.intervalCount = new SubscriptionPlanIntervalCountValueObject(
      props.intervalCount,
    );
    this.trialPeriodDays = props.trialPeriodDays
      ? new SubscriptionPlanTrialPeriodDaysValueObject(props.trialPeriodDays)
      : null;
    this.isActive = new SubscriptionPlanIsActiveValueObject(true);
    this.features = props.features
      ? new SubscriptionPlanFeaturesValueObject(props.features)
      : null;
    this.limits = props.limits
      ? new SubscriptionPlanLimitsValueObject(props.limits)
      : null;
    this.stripePriceId = props.stripePriceId
      ? new SubscriptionPlanStripePriceIdValueObject(props.stripePriceId)
      : null;
  }
}
