import { ISagaInstanceCreateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-create/saga-instance-create-view-model.dto';
import { ISagaInstanceUpdateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-update/saga-instance-update-view-model.dto';

/**
 * This class is used to represent a saga instance view model.
 */
export class SagaInstanceViewModel {
  private readonly _id: string;
  private _name: string;
  private _status: string;
  private _startDate: Date | null;
  private _endDate: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ISagaInstanceCreateViewModelDto) {
    this._id = props.id;
    this._name = props.name;
    this._status = props.status;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Updates the saga instance view model with new data
   *
   * @param updateData - The data to update
   * @returns A new SagaInstanceViewModel instance with updated data
   */
  public update(updateData: ISagaInstanceUpdateViewModelDto) {
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._startDate =
      updateData.startDate !== undefined
        ? updateData.startDate
        : this._startDate;
    this._endDate =
      updateData.endDate !== undefined ? updateData.endDate : this._endDate;
    this._updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the saga instance.
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the name of the saga instance.
   * @returns {string}
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the status of the saga instance.
   * @returns {string}
   */
  get status(): string {
    return this._status;
  }
  /**
   * Gets the start date of the saga instance.
   * @returns {Date | null}
   */
  get startDate(): Date | null {
    return this._startDate;
  }

  /**
   * Gets the end date of the saga instance.
   * @returns {Date | null}
   */
  get endDate(): Date | null {
    return this._endDate;
  }

  /**
   * Gets the creation timestamp of the saga instance.
   * @returns {Date}
   */
  get createdAt(): Date {
    return this._createdAt;
  }
  /**
   * Gets the last updated timestamp of the saga instance.
   * @returns {Date}
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
