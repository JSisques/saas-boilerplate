import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';
import { ISubscriptionPlanUpdateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-update/subscription-plan-update.dto';
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
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';
import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';
import { SubscriptionPlanUpdatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

export class SubscriptionPlanAggregate extends BaseAggregate {
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

  constructor(
    props: ISubscriptionPlanCreateDto,
    generateEvent: boolean = true,
  ) {
    super(props.createdAt, props.updatedAt);

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

    if (generateEvent) {
      this.apply(
        new SubscriptionPlanCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionPlanAggregate.name,
            eventType: SubscriptionPlanCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the subscription plan.
   *
   * @param props - The properties to update.
   * @param generateEvent - Whether to generate an event.
   */
  public update(
    props: ISubscriptionPlanUpdateDto,
    generateEvent: boolean = true,
  ): void {
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

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SubscriptionPlanUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionPlanAggregate.name,
            eventType: SubscriptionPlanUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the subscription plan.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public delete(generateEvent: boolean = true): void {
    this._isActive = new SubscriptionPlanIsActiveValueObject(false);

    if (generateEvent) {
      this.apply(
        new SubscriptionPlanDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionPlanAggregate.name,
            eventType: SubscriptionPlanDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Gets the unique identifier of the subscription plan.
   * @returns {SubscriptionPlanUuidValueObject} The subscription plan UUID value object.
   */
  public get id(): SubscriptionPlanUuidValueObject {
    return this._id;
  }

  /**
   * Gets the name of the subscription plan.
   * @returns {SubscriptionPlanNameValueObject} The name value object.
   */
  public get name(): SubscriptionPlanNameValueObject {
    return this._name;
  }

  /**
   * Gets the slug of the subscription plan (URL-friendly identifier).
   * @returns {SubscriptionPlanSlugValueObject} The slug value object.
   */
  public get slug(): SubscriptionPlanSlugValueObject {
    return this._slug;
  }

  /**
   * Gets the type of the subscription plan.
   * @returns {SubscriptionPlanTypeValueObject} The type value object.
   */
  public get type(): SubscriptionPlanTypeValueObject {
    return this._type;
  }

  /**
   * Gets the description of the subscription plan.
   * @returns {SubscriptionPlanDescriptionValueObject | null} The description value object or null.
   */
  public get description(): SubscriptionPlanDescriptionValueObject {
    return this._description;
  }

  /**
   * Gets the monthly price of the subscription plan.
   * @returns {SubscriptionPlanPriceMonthlyValueObject} The monthly price value object.
   */
  public get priceMonthly(): SubscriptionPlanPriceMonthlyValueObject {
    return this._priceMonthly;
  }

  /**
   * Gets the yearly price of the subscription plan.
   * @returns {SubscriptionPlanPriceYearlyValueObject} The yearly price value object.
   */
  public get priceYearly(): SubscriptionPlanPriceYearlyValueObject {
    return this._priceYearly;
  }

  /**
   * Gets the currency of the subscription plan.
   * @returns {SubscriptionPlanCurrencyValueObject} The currency value object.
   */
  public get currency(): SubscriptionPlanCurrencyValueObject {
    return this._currency;
  }

  /**
   * Gets the billing interval (e.g., monthly, yearly) of the subscription plan.
   * @returns {SubscriptionPlanIntervalValueObject} The interval value object.
   */
  public get interval(): SubscriptionPlanIntervalValueObject {
    return this._interval;
  }

  /**
   * Gets the number of intervals for the subscription plan (e.g., every 1 month).
   * @returns {SubscriptionPlanIntervalCountValueObject} The interval count value object.
   */
  public get intervalCount(): SubscriptionPlanIntervalCountValueObject {
    return this._intervalCount;
  }

  /**
   * Gets the number of trial period days of the subscription plan.
   * @returns {SubscriptionPlanTrialPeriodDaysValueObject | null} The trial period days value object or null.
   */
  public get trialPeriodDays(): SubscriptionPlanTrialPeriodDaysValueObject {
    return this._trialPeriodDays;
  }

  /**
   * Gets the active status of the subscription plan.
   * @returns {SubscriptionPlanIsActiveValueObject} The isActive value object.
   */
  public get isActive(): SubscriptionPlanIsActiveValueObject {
    return this._isActive;
  }

  /**
   * Gets the feature set of the subscription plan.
   * @returns {SubscriptionPlanFeaturesValueObject | null} The features value object or null.
   */
  public get features(): SubscriptionPlanFeaturesValueObject {
    return this._features;
  }

  /**
   * Gets the limits associated with the subscription plan.
   * @returns {SubscriptionPlanLimitsValueObject | null} The limits value object or null.
   */
  public get limits(): SubscriptionPlanLimitsValueObject {
    return this._limits;
  }

  /**
   * Gets the Stripe price identifier for this subscription plan.
   * @returns {SubscriptionPlanStripePriceIdValueObject | null} The Stripe price id value object or null.
   */
  public get stripePriceId(): SubscriptionPlanStripePriceIdValueObject {
    return this._stripePriceId;
  }

  /**
   * Converts the subscription plan aggregate to its primitive representation.
   * @returns {SubscriptionPlanPrimitives} The primitive representation of the subscription plan.
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
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
