import { ISubscriptionPlanCreateDto } from "@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto";
import { ISubscriptionPlanUpdateDto } from "@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-update/subscription-plan-update.dto";
import { SubscriptionPlanPrimitives } from "@/billing-context/subscription-plan/domain/primitives/subscription-plan.primitives";
import { SubscriptionPlanCurrencyValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo";
import { SubscriptionPlanDescriptionValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-description/subscription-plan-description.vo";
import { SubscriptionPlanFeaturesValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-features/subscription-plan-features.vo";
import { SubscriptionPlanIntervalCountValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo";
import { SubscriptionPlanIntervalValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo";
import { SubscriptionPlanIsActiveValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo";
import { SubscriptionPlanLimitsValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-limits/subscription-plan-limits.vo";
import { SubscriptionPlanNameValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo";
import { SubscriptionPlanPriceMonthlyValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo";
import { SubscriptionPlanPriceYearlyValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo";
import { SubscriptionPlanSlugValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo";
import { SubscriptionPlanStripePriceIdValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo";
import { SubscriptionPlanTrialPeriodDaysValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo";
import { SubscriptionPlanTypeValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo";
import { SubscriptionPlanUuidValueObject } from "@repo/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo";

/**
 * Subscription Plan Aggregate
 * Represents the subscription plan domain entity without event sourcing complexity
 */
export class SubscriptionPlanAggregate {
  private readonly _id: SubscriptionPlanUuidValueObject;
  private _name: SubscriptionPlanNameValueObject;
  private _slug: SubscriptionPlanSlugValueObject;
  private _type: SubscriptionPlanTypeValueObject;
  private _description: SubscriptionPlanDescriptionValueObject | null;
  private _priceMonthly: SubscriptionPlanPriceMonthlyValueObject;
  private _priceYearly: SubscriptionPlanPriceYearlyValueObject;
  private _currency: SubscriptionPlanCurrencyValueObject;
  private _interval: SubscriptionPlanIntervalValueObject;
  private _intervalCount: SubscriptionPlanIntervalCountValueObject;
  private _trialPeriodDays: SubscriptionPlanTrialPeriodDaysValueObject | null;
  private _isActive: SubscriptionPlanIsActiveValueObject;
  private _features: SubscriptionPlanFeaturesValueObject | null;
  private _limits: SubscriptionPlanLimitsValueObject | null;
  private _stripePriceId: SubscriptionPlanStripePriceIdValueObject | null;

  constructor(props: ISubscriptionPlanCreateDto) {
    // Set the properties
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._type = props.type;
    this._description = props.description;
    this._priceMonthly = props.priceMonthly;
    this._priceYearly = props.priceYearly;
    this._currency = props.currency;
    this._interval = props.interval;
    this._intervalCount = props.intervalCount;
    this._trialPeriodDays = props.trialPeriodDays;
    this._isActive = props.isActive;
    this._features = props.features;
    this._limits = props.limits;
    this._stripePriceId = props.stripePriceId;
  }

  /**
   * Update the subscription plan.
   *
   * @param props - The properties to update the subscription plan.
   */
  public update(props: ISubscriptionPlanUpdateDto) {
    // Update the properties
    // Use explicit null/undefined check: if value is explicitly passed (including null), update it
    this._name = props.name !== undefined ? props.name : this._name;
    this._slug = props.slug !== undefined ? props.slug : this._slug;
    this._type = props.type !== undefined ? props.type : this._type;
    this._description =
      props.description !== undefined ? props.description : this._description;
    this._priceMonthly =
      props.priceMonthly !== undefined
        ? props.priceMonthly
        : this._priceMonthly;
    this._priceYearly =
      props.priceYearly !== undefined ? props.priceYearly : this._priceYearly;
    this._currency =
      props.currency !== undefined ? props.currency : this._currency;
    this._interval =
      props.interval !== undefined ? props.interval : this._interval;
    this._intervalCount =
      props.intervalCount !== undefined
        ? props.intervalCount
        : this._intervalCount;
    this._trialPeriodDays =
      props.trialPeriodDays !== undefined
        ? props.trialPeriodDays
        : this._trialPeriodDays;
    this._isActive =
      props.isActive !== undefined ? props.isActive : this._isActive;
    this._features =
      props.features !== undefined ? props.features : this._features;
    this._limits = props.limits !== undefined ? props.limits : this._limits;
    this._stripePriceId =
      props.stripePriceId !== undefined
        ? props.stripePriceId
        : this._stripePriceId;
  }

  /**
   * Get the id of the subscription plan.
   *
   * @returns The id of the subscription plan.
   */
  public get id(): SubscriptionPlanUuidValueObject {
    return this._id;
  }

  /**
   * Get the name of the subscription plan.
   *
   * @returns The name of the subscription plan.
   */
  public get name(): SubscriptionPlanNameValueObject {
    return this._name;
  }

  /**
   * Get the slug of the subscription plan.
   *
   * @returns The slug of the subscription plan.
   */
  public get slug(): SubscriptionPlanSlugValueObject {
    return this._slug;
  }

  /**
   * Get the type of the subscription plan.
   *
   * @returns The type of the subscription plan.
   */
  public get type(): SubscriptionPlanTypeValueObject {
    return this._type;
  }

  /**
   * Get the description of the subscription plan.
   *
   * @returns The description of the subscription plan.
   */
  public get description(): SubscriptionPlanDescriptionValueObject | null {
    return this._description;
  }

  /**
   * Get the price monthly of the subscription plan.
   *
   * @returns The price monthly of the subscription plan.
   */
  public get priceMonthly(): SubscriptionPlanPriceMonthlyValueObject {
    return this._priceMonthly;
  }

  /**
   * Get the price yearly of the subscription plan.
   *
   * @returns The price yearly of the subscription plan.
   */
  public get priceYearly(): SubscriptionPlanPriceYearlyValueObject {
    return this._priceYearly;
  }

  /**
   * Get the currency of the subscription plan.
   *
   * @returns The currency of the subscription plan.
   */
  public get currency(): SubscriptionPlanCurrencyValueObject {
    return this._currency;
  }

  /**
   * Get the interval of the subscription plan.
   *
   * @returns The interval of the subscription plan.
   */
  public get interval(): SubscriptionPlanIntervalValueObject {
    return this._interval;
  }

  /**
   * Get the interval count of the subscription plan.
   *
   * @returns The interval count of the subscription plan.
   */
  public get intervalCount(): SubscriptionPlanIntervalCountValueObject {
    return this._intervalCount;
  }

  /**
   * Get the trial period days of the subscription plan.
   *
   * @returns The trial period days of the subscription plan.
   */
  public get trialPeriodDays(): SubscriptionPlanTrialPeriodDaysValueObject | null {
    return this._trialPeriodDays;
  }

  /**
   * Get the is active of the subscription plan.
   *
   * @returns The is active of the subscription plan.
   */
  public get isActive(): SubscriptionPlanIsActiveValueObject {
    return this._isActive;
  }

  /**
   * Get the features of the subscription plan.
   *
   * @returns The features of the subscription plan.
   */
  public get features(): SubscriptionPlanFeaturesValueObject | null {
    return this._features;
  }

  /**
   * Get the limits of the subscription plan.
   *
   * @returns The limits of the subscription plan.
   */
  public get limits(): SubscriptionPlanLimitsValueObject | null {
    return this._limits;
  }

  /**
   * Get the stripe price id of the subscription plan.
   *
   * @returns The stripe price id of the subscription plan.
   */
  public get stripePriceId(): SubscriptionPlanStripePriceIdValueObject | null {
    return this._stripePriceId;
  }

  /**
   * Convert the subscription plan aggregate to primitives.
   *
   * @returns The primitives of the subscription plan.
   */
  public toPrimitives(): SubscriptionPlanPrimitives {
    return {
      id: this._id.value,
      name: this._name.value,
      slug: this._slug.value,
      type: this._type.value,
      description: this._description ? this._description.value : null,
      priceMonthly: this._priceMonthly.value,
      priceYearly: this._priceYearly.value,
      currency: this._currency.value,
      interval: this._interval.value,
      intervalCount: this._intervalCount.value,
      trialPeriodDays: this._trialPeriodDays
        ? this._trialPeriodDays.value
        : null,
      isActive: this._isActive.value,
      features: this._features ? this._features.value : null,
      limits: this._limits ? this._limits.value : null,
      stripePriceId: this._stripePriceId ? this._stripePriceId.value : null,
    };
  }
}
