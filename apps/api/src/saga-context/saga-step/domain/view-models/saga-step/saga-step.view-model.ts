import { ISagaStepCreateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-create/saga-step-create-view-model.dto';
import { ISagaStepUpdateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-update/saga-step-update-view-model.dto';

/**
 * This class is used to represent a saga step view model.
 */
export class SagaStepViewModel {
  private readonly _id: string;
  private readonly _sagaInstanceId: string;
  private _name: string;
  private _order: number;
  private _status: string;
  private _startDate: Date | null;
  private _endDate: Date | null;
  private _errorMessage: string | null;
  private _retryCount: number;
  private _maxRetries: number;
  private _payload: any;
  private _result: any;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ISagaStepCreateViewModelDto) {
    this._id = props.id;
    this._sagaInstanceId = props.sagaInstanceId;
    this._name = props.name;
    this._order = props.order;
    this._status = props.status;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._errorMessage = props.errorMessage;
    this._retryCount = props.retryCount;
    this._maxRetries = props.maxRetries;
    this._payload = props.payload;
    this._result = props.result;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Updates the saga step view model with new data
   *
   * @param updateData - The data to update
   */
  public update(updateData: ISagaStepUpdateViewModelDto): void {
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._order =
      updateData.order !== undefined ? updateData.order : this._order;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._startDate =
      updateData.startDate !== undefined
        ? updateData.startDate
        : this._startDate;
    this._endDate =
      updateData.endDate !== undefined ? updateData.endDate : this._endDate;
    this._errorMessage =
      updateData.errorMessage !== undefined
        ? updateData.errorMessage
        : this._errorMessage;
    this._retryCount =
      updateData.retryCount !== undefined
        ? updateData.retryCount
        : this._retryCount;
    this._maxRetries =
      updateData.maxRetries !== undefined
        ? updateData.maxRetries
        : this._maxRetries;
    this._payload =
      updateData.payload !== undefined ? updateData.payload : this._payload;
    this._result =
      updateData.result !== undefined ? updateData.result : this._result;
    this._updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the saga step.
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the saga instance id of the saga step.
   * @returns {string}
   */
  get sagaInstanceId(): string {
    return this._sagaInstanceId;
  }

  /**
   * Gets the name of the saga step.
   * @returns {string}
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the order of the saga step.
   * @returns {number}
   */
  get order(): number {
    return this._order;
  }

  /**
   * Gets the status of the saga step.
   * @returns {string}
   */
  get status(): string {
    return this._status;
  }

  /**
   * Gets the start date of the saga step.
   * @returns {Date | null}
   */
  get startDate(): Date | null {
    return this._startDate;
  }

  /**
   * Gets the end date of the saga step.
   * @returns {Date | null}
   */
  get endDate(): Date | null {
    return this._endDate;
  }

  /**
   * Gets the error message of the saga step.
   * @returns {string | null}
   */
  get errorMessage(): string | null {
    return this._errorMessage;
  }

  /**
   * Gets the retry count of the saga step.
   * @returns {number}
   */
  get retryCount(): number {
    return this._retryCount;
  }

  /**
   * Gets the max retries of the saga step.
   * @returns {number}
   */
  get maxRetries(): number {
    return this._maxRetries;
  }

  /**
   * Gets the payload of the saga step.
   * @returns {any}
   */
  get payload(): any {
    return this._payload;
  }

  /**
   * Gets the result of the saga step.
   * @returns {any}
   */
  get result(): any {
    return this._result;
  }

  /**
   * Gets the creation timestamp of the saga step.
   * @returns {Date}
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Gets the last updated timestamp of the saga step.
   * @returns {Date}
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
