import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { IEventCreateDto } from '@/event-store-context/event/domain/dtos/entities/event-create/event-create.dto';
import { EventPrimitives } from '@/event-store-context/event/domain/primitives/event.primitives';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * This factory class is used to create a new event store aggregate.
 */
@Injectable()
export class EventAggregateFactory
  implements IWriteFactory<EventAggregate, IEventCreateDto, EventPrimitives>
{
  /**
   * Creates a new event aggregate with the given properties.
   *
   * @param data - The data to create the event aggregate.
   * @param data.id - The id of the event.
   * @param data.eventType - The event type of the event.
   * @param data.aggregateType - The aggregate type of the event.
   * @param data.aggregateId - The aggregate id of the event.
   * @param data.payload - The payload of the event.
   * @param data.timestamp - The timestamp of the event.
   *
   * @returns The event entity.
   */
  public create(data: IEventCreateDto): EventAggregate {
    return new EventAggregate(data);
  }

  /**
   * Creates a new event store entity from primitive data.
   *
   * @param primitives - The primitive data to create the event entity from.
   * @param primitives.id - The id of the event.
   * @param primitives.eventType - The event type of the event.
   * @param primitives.aggregateType - The aggregate type of the event.
   * @param primitives.aggregateId - The aggregate id of the event.
   * @param primitives.payload - The payload of the event.
   * @param primitives.timestamp - The timestamp of the event.
   *
   * @returns
   */
  public fromPrimitives(primitives: EventPrimitives): EventAggregate {
    return new EventAggregate({
      id: new EventUuidValueObject(primitives.id),
      eventType: new EventTypeValueObject(primitives.eventType),
      aggregateType: new EventAggregateTypeValueObject(
        primitives.aggregateType,
      ),
      aggregateId: new EventAggregateIdValueObject(primitives.aggregateId),
      payload: new EventPayloadValueObject(primitives.payload),
      timestamp: new EventTimestampValueObject(primitives.timestamp),
    });
  }
}
