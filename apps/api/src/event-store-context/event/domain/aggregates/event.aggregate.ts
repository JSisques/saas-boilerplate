import { IEventCreateDto } from '@/event-store-context/event/domain/dtos/entities/event-create/event-create.dto';
import { EventPrimitives } from '@/event-store-context/event/domain/primitives/event.primitives';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

export class EventAggregate extends BaseAggregate {
  private readonly _id: EventUuidValueObject;
  private readonly _aggregateId: EventAggregateIdValueObject;
  private readonly _aggregateType: EventAggregateTypeValueObject;
  private readonly _eventType: EventTypeValueObject;
  private readonly _payload: EventPayloadValueObject | null;
  private readonly _timestamp: EventTimestampValueObject;

  constructor(props: IEventCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);

    this._id = props.id;
    this._aggregateId = props.aggregateId;
    this._aggregateType = props.aggregateType;
    this._eventType = props.eventType;
    this._payload = props.payload;
    this._timestamp = props.timestamp;

    if (generateEvent) {
      this.apply(
        new EventCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: EventAggregate.name,
            eventType: EventCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  public get id(): EventUuidValueObject {
    return this._id;
  }

  public get eventType(): EventTypeValueObject {
    return this._eventType;
  }

  public get aggregateType(): EventAggregateTypeValueObject {
    return this._aggregateType;
  }

  public get aggregateId(): EventAggregateIdValueObject {
    return this._aggregateId;
  }

  public get payload(): EventPayloadValueObject | null {
    return this._payload;
  }

  public get timestamp(): EventTimestampValueObject {
    return this._timestamp;
  }

  public toPrimitives(): EventPrimitives {
    return {
      id: this._id.value,
      eventType: this._eventType.value,
      aggregateType: this._aggregateType.value,
      aggregateId: this._aggregateId.value,
      payload: this._payload?.value ?? null,
      timestamp: this._timestamp.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
