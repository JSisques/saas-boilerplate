import { ISubscriptionPlanCreateViewModelDto } from "@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto";
import { ISubscriptionPlanUpdateViewModelDto } from "@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-update-view-model/subscription-plan-update-view-model.dto";

/**
 * Represents a subscription plan's view model.
 * Encapsulates and exposes properties for the subscription plan.
 */
export class SubscriptionPlanViewModel {
  private readonly _id: string;
  private _name: string;
  private _slug: string;
  private _type: string;
  private _description: string | null;
  private _priceMonthly: number;
  private _priceYearly: number;
  private _currency: string;
  private _interval: string;
  private _intervalCount: number;
  private _trialPeriodDays: number | null;
  private _isActive: boolean;
  private _features: Record<string, unknown> | null;
  private _limits: Record<string, unknown> | null;
  private _stripePriceId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Constructs a SubscriptionPlanViewModel instance.
   * @param props - The properties for creating the subscription plan view model.
   */
  constructor(props: ISubscriptionPlanCreateViewModelDto) {
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
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  /**
   * Updates the subscription plan view model with new data
   *
   * @param   updateData - The data to update
   * @returns A new SubscriptionPlanViewModel instance with updated data
   */
  public update(updateData: ISubscriptionPlanUpdateViewModelDto) {
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._slug = updateData.slug !== undefined ? updateData.slug : this._slug;
    this._type = updateData.type !== undefined ? updateData.type : this._type;
    this._description =
      updateData.description !== undefined
        ? updateData.description
        : this._description;
    this._priceMonthly =
      updateData.priceMonthly !== undefined
        ? updateData.priceMonthly
        : this._priceMonthly;
    this._priceYearly =
      updateData.priceYearly !== undefined
        ? updateData.priceYearly
        : this._priceYearly;
    this._currency =
      updateData.currency !== undefined ? updateData.currency : this._currency;
    this._interval =
      updateData.interval !== undefined ? updateData.interval : this._interval;
    this._intervalCount =
      updateData.intervalCount !== undefined
        ? updateData.intervalCount
        : this._intervalCount;
    this._trialPeriodDays =
      updateData.trialPeriodDays !== undefined
        ? updateData.trialPeriodDays
        : this._trialPeriodDays;
    this._isActive =
      updateData.isActive !== undefined ? updateData.isActive : this._isActive;
    this._features =
      updateData.features !== undefined ? updateData.features : this._features;
    this._limits =
      updateData.limits !== undefined ? updateData.limits : this._limits;
    this._stripePriceId =
      updateData.stripePriceId !== undefined
        ? updateData.stripePriceId
        : this._stripePriceId;
    this._updatedAt = new Date();
  }

  /** @returns {string} The unique identifier of the subscription plan */
  public get id(): string {
    return this._id;
  }

  /** @returns {string} The name of the subscription plan */
  public get name(): string {
    return this._name;
  }

  /** @returns {string} The slug of the subscription plan */
  public get slug(): string {
    return this._slug;
  }

  /** @returns {string} The type/category of the subscription plan */
  public get type(): string {
    return this._type;
  }

  /** @returns {string | null} The description of the subscription plan */
  public get description(): string | null {
    return this._description;
  }

  /** @returns {number} The monthly price of the subscription plan */
  public get priceMonthly(): number {
    return this._priceMonthly;
  }

  /** @returns {number} The yearly price of the subscription plan */
  public get priceYearly(): number {
    return this._priceYearly;
  }

  /** @returns {string} The currency of the subscription plan */
  public get currency(): string {
    return this._currency;
  }

  /** @returns {string} The billing interval (e.g., month, year) */
  public get interval(): string {
    return this._interval;
  }

  /** @returns {number} The billing interval count */
  public get intervalCount(): number {
    return this._intervalCount;
  }

  /** @returns {number | null} The number of trial period days */
  public get trialPeriodDays(): number | null {
    return this._trialPeriodDays;
  }

  /** @returns {boolean} Whether the subscription plan is active */
  public get isActive(): boolean {
    return this._isActive;
  }

  /** @returns {Record<string, unknown> | null} Features available in the subscription plan */
  public get features(): Record<string, unknown> | null {
    return this._features;
  }

  /** @returns {Record<string, unknown> | null} Limits applied to the subscription plan */
  public get limits(): Record<string, unknown> | null {
    return this._limits;
  }

  /** @returns {string | null} Associated Stripe price identifier */
  public get stripePriceId(): string | null {
    return this._stripePriceId;
  }

  /** @returns {Date} The timestamp when the subscription plan was created */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /** @returns {Date} The timestamp when the subscription plan was last updated */
  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
