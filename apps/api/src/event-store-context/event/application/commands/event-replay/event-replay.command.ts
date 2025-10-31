import { IEventReplayCommandDto } from '@/event-store-context/event/application/dtos/commands/event-replay/event-replay-command.dto';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

export class EventReplayCommand {
  readonly id?: EventUuidValueObject;
  readonly eventType: EventTypeValueObject;
  readonly aggregateId?: EventAggregateIdValueObject;
  readonly aggregateType?: EventAggregateTypeValueObject;
  readonly from: Date;
  readonly to: Date;
  readonly batchSize?: number;

  constructor(props: IEventReplayCommandDto) {
    this.id = props.id ? new EventUuidValueObject(props.id) : undefined;
    this.eventType = new EventTypeValueObject(props.eventType);
    this.aggregateId = props.aggregateId
      ? new EventAggregateIdValueObject(props.aggregateId)
      : undefined;
    this.aggregateType = props.aggregateType
      ? new EventAggregateTypeValueObject(props.aggregateType)
      : undefined;
    this.from = props.from;
    this.to = props.to;
    this.batchSize = props.batchSize;
  }
}
