import { EventAggregate } from '@/event-store-context/users/domain/aggregates/event.aggregate';
import { IEventCreateDto } from '@/event-store-context/users/domain/dtos/entities/event-create/event-create.dto';
import { EventPrimitives } from '@/event-store-context/users/domain/primitives/event.primitives';
import { EventAggregateIdValueObject } from '@/event-store-context/users/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/users/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/users/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/users/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/users/domain/value-objects/event-type/event-type.vo';
import { IWriteFactory } from '@repo/shared/domain/interfaces/write-factory.interface';
import { EventUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

/**
 * Factory class responsible for creating UserAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate user information.
 */
export class EventAggregateFactory
  implements IWriteFactory<EventAggregate, IEventCreateDto>
{
  /**
   * Creates a new EventAggregate entity using the provided properties.
   *
   * @param data - The event create data.
   * @returns {EventAggregate} - The created event aggregate entity.
   */
  public create(data: IEventCreateDto): EventAggregate {
    return new EventAggregate(data);
  }

  /**
   * Creates a new EventAggregate entity from primitive data.
   *
   * @param data - The event primitive data.
   * @returns The created event aggregate entity.
   */
  public fromPrimitives(data: EventPrimitives): EventAggregate {
    return new EventAggregate({
      id: new EventUuidValueObject(data.id),
      eventType: new EventTypeValueObject(data.eventType),
      aggregateType: new EventAggregateTypeValueObject(data.aggregateType),
      aggregateId: new EventAggregateIdValueObject(data.aggregateId),
      payload: new EventPayloadValueObject(JSON.stringify(data.payload)),
      timestamp: new EventTimestampValueObject(data.timestamp),
    });
  }
}
