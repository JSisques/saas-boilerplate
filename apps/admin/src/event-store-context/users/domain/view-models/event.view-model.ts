import { IEventCreateViewModelDto } from '@/event-store-context/users/domain/dtos/view-models/event-create/event-create-view-model.dto';
import { IEventUpdateViewModelDto } from '@/event-store-context/users/domain/dtos/view-models/event-update/event-update-view-model.dto';

/**
 * This class is used to represent a user view model.
 */
export class EventViewModel {
  private readonly _id: string;
  private _eventType: string;
  private _aggregateType: string;
  private _aggregateId: string;
  private _payload: Record<string, unknown>;
  private _timestamp: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IEventCreateViewModelDto) {
    this._id = props.id;
    this._eventType = props.eventType;
    this._aggregateType = props.aggregateType;
    this._aggregateId = props.aggregateId;
    this._payload = props.payload;
    this._timestamp = props.timestamp;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get eventType(): string {
    return this._eventType;
  }

  public get aggregateType(): string {
    return this._aggregateType;
  }

  public get aggregateId(): string {
    return this._aggregateId;
  }

  public get payload(): Record<string, unknown> {
    return this._payload;
  }

  public get timestamp(): Date {
    return this._timestamp;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Updates the event view model with new data
   *
   * @param updateData - The data to update
   */
  public update(updateData: IEventUpdateViewModelDto) {
    this._eventType =
      updateData.eventType !== undefined
        ? updateData.eventType
        : this._eventType;
    this._aggregateType =
      updateData.aggregateType !== undefined
        ? updateData.aggregateType
        : this._aggregateType;
    this._aggregateId =
      updateData.aggregateId !== undefined
        ? updateData.aggregateId
        : this._aggregateId;
    this._payload =
      updateData.payload !== undefined ? updateData.payload : this._payload;
    this._timestamp =
      updateData.timestamp !== undefined
        ? updateData.timestamp
        : this._timestamp;
    this._updatedAt = new Date();
  }
}
