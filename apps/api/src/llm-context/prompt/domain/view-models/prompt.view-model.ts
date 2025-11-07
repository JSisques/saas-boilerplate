import { IPromptCreateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-create-view-model/prompt-create-view-model.dto';
import { IPromptUpdateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-update-view-model/prompt-update-view-model.dto';

/**
 * Represents a subscription plan's view model.
 * Encapsulates and exposes properties for the subscription plan.
 */
export class PromptViewModel {
  private readonly _id: string;
  private _slug: string;
  private _version: number;
  private _title: string;
  private _description: string | null;
  private _content: string;
  private _status: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Constructs a SubscriptionViewModel instance.
   * @param props - The properties for creating the subscription plan view model.
   */
  constructor(props: IPromptCreateViewModelDto) {
    this._id = props.id;
    this._slug = props.slug;
    this._version = props.version;
    this._title = props.title;
    this._description = props.description;
    this._content = props.content;
    this._status = props.status;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  /**
   * Updates the subscription plan view model with new data
   *
   * @param   updateData - The data to update
   * @returns A new SubscriptionViewModel instance with updated data
   */
  public update(updateData: IPromptUpdateViewModelDto) {
    this._slug = updateData.slug !== undefined ? updateData.slug : this._slug;
    this._version =
      updateData.version !== undefined ? updateData.version : this._version;
    this._title =
      updateData.title !== undefined ? updateData.title : this._title;
    this._description =
      updateData.description !== undefined
        ? updateData.description
        : this._description;
    this._content =
      updateData.content !== undefined ? updateData.content : this._content;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._isActive =
      updateData.isActive !== undefined ? updateData.isActive : this._isActive;
    this._updatedAt = new Date();
  }

  /** @returns {string} The unique identifier of the subscription */
  public get id(): string {
    return this._id;
  }

  /** @returns {string} The name of the subscription */
  public get slug(): string {
    return this._slug;
  }

  /** @returns {string} The plan id of the subscription */
  public get version(): number {
    return this._version;
  }

  /** @returns {Date} The start date of the subscription */
  public get title(): string {
    return this._title;
  }

  /** @returns {Date} The end date of the subscription */
  public get description(): string | null {
    return this._description;
  }

  /** @returns {Date | null} The trial end date of the subscription */
  public get content(): string {
    return this._content;
  }

  /** @returns {string} The status of the subscription */
  public get status(): string {
    return this._status;
  }
  /** @returns {boolean} The is active of the subscription */
  public get isActive(): boolean {
    return this._isActive;
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
