import { IEventCreateViewModelDto } from '@/event-store-context/event/domain/dtos/view-models/event-create/event-create-view-model.dto';

/**
 * This class is used to represent a event store view model.
 */
export class EventViewModel {
  private readonly _id: string;
  private readonly _eventType: string;
  private readonly _aggregateType: string;
  private readonly _aggregateId: string;
  private readonly _payload: Record<string, any>;
  private readonly _timestamp: Date;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

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

  public get payload(): Record<string, any> {
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
}
