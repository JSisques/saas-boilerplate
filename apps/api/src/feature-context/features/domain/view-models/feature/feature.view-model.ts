import { IFeatureCreateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-create/feature-create-view-model.dto';
import { IFeatureUpdateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-update/feature-update-view-model.dto';

/**
 * This class is used to represent a feature view model.
 */
export class FeatureViewModel {
  private readonly _id: string;
  private _key: string;
  private _name: string;
  private _description: string | null;
  private _status: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IFeatureCreateViewModelDto) {
    this._id = props.id;
    this._key = props.key;
    this._name = props.name;
    this._description = props.description;
    this._status = props.status;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  /**
   * Updates the feature view model with new data
   *
   * @param updateData - The data to update
   */
  public update(updateData: IFeatureUpdateViewModelDto) {
    this._key = updateData.key !== undefined ? updateData.key : this._key;
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._description =
      updateData.description !== undefined
        ? updateData.description
        : this._description;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the feature.
   * @returns {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the key of the feature.
   * @returns {string}
   */
  public get key(): string {
    return this._key;
  }

  /**
   * Gets the name of the feature.
   * @returns {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Gets the description of the feature.
   * @returns {string | null}
   */
  public get description(): string | null {
    return this._description;
  }

  /**
   * Gets the status of the feature.
   * @returns {string}
   */
  public get status(): string {
    return this._status;
  }

  /**
   * Gets the creation timestamp of the feature.
   * @returns {Date}
   */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Gets the last updated timestamp of the feature.
   * @returns {Date}
   */
  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
