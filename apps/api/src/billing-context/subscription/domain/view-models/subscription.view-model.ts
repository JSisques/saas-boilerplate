import { ISubscriptionCreateViewModelDto } from '@/billing-context/subscription/domain/dtos/view-models/subscription-create-view-model/subscription-create-view-model.dto';
import { ISubscriptionUpdateViewModelDto } from '@/billing-context/subscription/domain/dtos/view-models/subscription-update-view-model/subscription-update-view-model.dto';

/**
 * Represents a subscription plan's view model.
 * Encapsulates and exposes properties for the subscription plan.
 */
export class SubscriptionViewModel {
  private readonly _id: string;
  private _tenantId: string;
  private _planId: string;
  private _startDate: Date;
  private _endDate: Date;
  private _trialEndDate: Date | null;
  private _status: string;
  private _stripeSubscriptionId: string | null;
  private _stripeCustomerId: string | null;
  private _renewalMethod: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Constructs a SubscriptionViewModel instance.
   * @param props - The properties for creating the subscription plan view model.
   */
  constructor(props: ISubscriptionCreateViewModelDto) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._planId = props.planId;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._trialEndDate = props.trialEndDate;
    this._status = props.status;
    this._stripeSubscriptionId = props.stripeSubscriptionId;
    this._stripeCustomerId = props.stripeCustomerId;
    this._renewalMethod = props.renewalMethod;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  /**
   * Updates the subscription plan view model with new data
   *
   * @param   updateData - The data to update
   * @returns A new SubscriptionViewModel instance with updated data
   */
  public update(updateData: ISubscriptionUpdateViewModelDto) {
    this._startDate =
      updateData.startDate !== undefined
        ? updateData.startDate
        : this._startDate;
    this._endDate =
      updateData.endDate !== undefined ? updateData.endDate : this._endDate;
    this._trialEndDate =
      updateData.trialEndDate !== undefined
        ? updateData.trialEndDate
        : this._trialEndDate;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._stripeSubscriptionId =
      updateData.stripeSubscriptionId !== undefined
        ? updateData.stripeSubscriptionId
        : this._stripeSubscriptionId;
    this._stripeCustomerId =
      updateData.stripeCustomerId !== undefined
        ? updateData.stripeCustomerId
        : this._stripeCustomerId;
    this._renewalMethod =
      updateData.renewalMethod !== undefined
        ? updateData.renewalMethod
        : this._renewalMethod;
    this._updatedAt = new Date();
  }

  /** @returns {string} The unique identifier of the subscription */
  public get id(): string {
    return this._id;
  }

  /** @returns {string} The name of the subscription */
  public get tenantId(): string {
    return this._tenantId;
  }

  /** @returns {string} The plan id of the subscription */
  public get planId(): string {
    return this._planId;
  }

  /** @returns {Date} The start date of the subscription */
  public get startDate(): Date {
    return this._startDate;
  }

  /** @returns {Date} The end date of the subscription */
  public get endDate(): Date {
    return this._endDate;
  }

  /** @returns {Date | null} The trial end date of the subscription */
  public get trialEndDate(): Date | null {
    return this._trialEndDate;
  }

  /** @returns {string} The status of the subscription */
  public get status(): string {
    return this._status;
  }

  /** @returns {string | null} The stripe subscription id of the subscription */
  public get stripeSubscriptionId(): string | null {
    return this._stripeSubscriptionId;
  }

  /** @returns {string | null} The stripe customer id of the subscription */
  public get stripeCustomerId(): string | null {
    return this._stripeCustomerId;
  }

  /** @returns {string} The renewal method of the subscription */
  public get renewalMethod(): string {
    return this._renewalMethod;
  }

  /** @returns {Date} The timestamp when the subscription was created */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /** @returns {Date} The timestamp when the subscription plan was last updated */
  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
