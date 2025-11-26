import { IEventCreateDto } from '@/event-store-context/users/domain/dtos/entities/event-create/event-create.dto';
import { IEventUpdateDto } from '@/event-store-context/users/domain/dtos/entities/event-update/event-update.dto';
import { EventPrimitives } from '@/event-store-context/users/domain/primitives/event.primitives';
import { EventAggregateIdValueObject } from '@/event-store-context/users/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/users/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/users/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/users/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/users/domain/value-objects/event-type/event-type.vo';
import { EventUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

/**
 * User Aggregate
 * Represents the user domain entity without event sourcing complexity
 */
export class EventAggregate {
  private readonly _id: EventUuidValueObject;
  private _aggregateId: EventAggregateIdValueObject;
  private _aggregateType: EventAggregateTypeValueObject;
  private _eventType: EventTypeValueObject;
  private _payload: EventPayloadValueObject | null;
  private _timestamp: EventTimestampValueObject;

  constructor(props: IEventCreateDto) {
    // Set the properties
    this._id = props.id;
    this._aggregateId = props.aggregateId;
    this._aggregateType = props.aggregateType;
    this._eventType = props.eventType;
    this._payload = props.payload;
    this._timestamp = props.timestamp;
  }

  /**
   * Update the event.
   *
   * @param props - The properties to update the event.
   */
  public update(props: IEventUpdateDto) {
    // Update the properties
    // Use explicit null/undefined check: if value is explicitly passed (including null), update it
    this._aggregateId =
      props.aggregateId !== undefined ? props.aggregateId : this._aggregateId;
    this._aggregateType =
      props.aggregateType !== undefined
        ? props.aggregateType
        : this._aggregateType;
    this._eventType =
      props.eventType !== undefined ? props.eventType : this._eventType;
    this._payload = props.payload !== undefined ? props.payload : this._payload;
    this._timestamp =
      props.timestamp !== undefined ? props.timestamp : this._timestamp;
  }

  /**
   * Get the id of the event.
   *
   * @returns The id of the event.
   */
  public get id(): EventUuidValueObject {
    return this._id;
  }

  /**
   * Get the event type of the event.
   *
   * @returns The event type of the event.
   */
  public get eventType(): EventTypeValueObject {
    return this._eventType;
  }

  /**
   * Get the aggregate type of the event.
   *
   * @returns The aggregate type of the event.
   */
  public get aggregateType(): EventAggregateTypeValueObject {
    return this._aggregateType;
  }

  /**
   * Get the aggregate id of the event.
   *
   * @returns The aggregate id of the event.
   */
  public get aggregateId(): EventAggregateIdValueObject {
    return this._aggregateId;
  }

  /**
   * Get the payload of the event.
   *
   * @returns The payload of the event.
   */
  public get payload(): EventPayloadValueObject | null {
    return this._payload;
  }

  /**
   * Get the timestamp of the event.
   *
   * @returns The timestamp of the event.
   */
  public get timestamp(): EventTimestampValueObject {
    return this._timestamp;
  }

  /**
   * Convert the event aggregate to primitives.
   *
   * @returns The primitives of the event.
   */
  public toPrimitives(): EventPrimitives {
    return {
      id: this._id.value,
      eventType: this._eventType.value,
      aggregateType: this._aggregateType.value,
      aggregateId: this._aggregateId.value,
      payload: this._payload?.value ?? {},
      timestamp: this._timestamp.value,
    };
  }
}
