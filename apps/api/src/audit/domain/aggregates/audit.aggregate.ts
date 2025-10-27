import { AuditPrimitives } from '@/audit/domain/primitives/audit.primitives';
import { AuditAggregateIdValueObject } from '@/audit/domain/value-objects/audit-aggregate-id/audit-aggregate-id.vo';
import { AuditAggregateTypeValueObject } from '@/audit/domain/value-objects/audit-aggregate-type/audit-aggregate-type.vo';
import { AuditEventTypeValueObject } from '@/audit/domain/value-objects/audit-event-type/audit-event-type.vo';
import { AuditPayloadValueObject } from '@/audit/domain/value-objects/audit-payload/audit-payload.vo';
import { AuditTimestampValueObject } from '@/audit/domain/value-objects/audit-timestamp/audit-timestamp.vo';
import { AuditCreatedEvent } from '@/shared/domain/events/audit/audit-created/audit-created.event';
import { AuditUuidValueObject } from '@/shared/domain/value-objects/identifiers/audit-uuid/audit-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class AuditAggregate extends AggregateRoot {
  private readonly _id: AuditUuidValueObject;
  private readonly _aggregateId: AuditAggregateIdValueObject;
  private readonly _aggregateType: AuditAggregateTypeValueObject;
  private readonly _eventType: AuditEventTypeValueObject;
  private readonly _payload: AuditPayloadValueObject | null;
  private readonly _timestamp: AuditTimestampValueObject;

  constructor(props: {
    id: AuditUuidValueObject;
    eventType: AuditEventTypeValueObject;
    aggregateType: AuditAggregateTypeValueObject;
    aggregateId: AuditAggregateIdValueObject;
    payload: AuditPayloadValueObject | null;
    timestamp: AuditTimestampValueObject;
  }) {
    super();

    this._id = props.id;
    this._aggregateId = props.aggregateId;
    this._aggregateType = props.aggregateType;
    this._eventType = props.eventType;
    this._payload = props.payload;
    this._timestamp = props.timestamp;

    this.apply(
      new AuditCreatedEvent(
        {
          aggregateId: this._id.value,
          aggregateType: AuditAggregate.name,
          eventType: AuditCreatedEvent.name,
        },
        this.toPrimitives(),
      ),
    );
  }

  public get id(): AuditUuidValueObject {
    return this._id;
  }

  public get eventType(): AuditEventTypeValueObject {
    return this._eventType;
  }

  public get aggregateType(): AuditAggregateTypeValueObject {
    return this._aggregateType;
  }

  public get aggregateId(): AuditAggregateIdValueObject {
    return this._aggregateId;
  }

  public get payload(): AuditPayloadValueObject | null {
    return this._payload;
  }

  public get timestamp(): AuditTimestampValueObject {
    return this._timestamp;
  }

  public toPrimitives(): AuditPrimitives {
    return {
      id: this._id.value,
      eventType: this._eventType.value,
      aggregateType: this._aggregateType.value,
      aggregateId: this._aggregateId.value,
      payload: this._payload?.value ?? null,
      timestamp: this._timestamp.value,
    };
  }
}
