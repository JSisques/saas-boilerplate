import { ISagaLogCreateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-create/saga-log-create-view-model.dto';
import { ISagaLogUpdateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-update/saga-log-update-view-model.dto';

/**
 * This class is used to represent a saga log view model.
 */
export class SagaLogViewModel {
  private readonly _id: string;
  private readonly _sagaInstanceId: string;
  private readonly _sagaStepId: string;
  private _type: string;
  private _message: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ISagaLogCreateViewModelDto) {
    this._id = props.id;
    this._sagaInstanceId = props.sagaInstanceId;
    this._sagaStepId = props.sagaStepId;
    this._type = props.type;
    this._message = props.message;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Updates the saga log view model with new data
   *
   * @param updateData - The data to update
   */
  public update(updateData: ISagaLogUpdateViewModelDto): void {
    this._type = updateData.type !== undefined ? updateData.type : this._type;
    this._message =
      updateData.message !== undefined ? updateData.message : this._message;
    this._updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the saga log.
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the saga instance id of the saga log.
   * @returns {string}
   */
  get sagaInstanceId(): string {
    return this._sagaInstanceId;
  }

  /**
   * Gets the saga step id of the saga log.
   * @returns {string}
   */
  get sagaStepId(): string {
    return this._sagaStepId;
  }

  /**
   * Gets the type of the saga log.
   * @returns {string}
   */
  get type(): string {
    return this._type;
  }

  /**
   * Gets the message of the saga log.
   * @returns {string}
   */
  get message(): string {
    return this._message;
  }

  /**
   * Gets the creation timestamp of the saga log.
   * @returns {Date}
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Gets the last updated timestamp of the saga log.
   * @returns {Date}
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
