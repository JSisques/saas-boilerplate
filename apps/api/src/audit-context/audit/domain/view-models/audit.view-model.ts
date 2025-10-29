/**
 * This class is used to represent a audit view model.
 */
export class AuditViewModel {
  private readonly _id: string;
  private readonly _eventType: string;
  private readonly _aggregateType: string;
  private readonly _aggregateId: string;
  private readonly _payload: Record<string, any>;
  private readonly _timestamp: Date;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: {
    id: string;
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    payload: Record<string, any>;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
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
