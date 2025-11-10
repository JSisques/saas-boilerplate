import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate.factory';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventAggregate', () => {
  const createProps = () => {
    return {
      id: new EventUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      aggregateId: new EventAggregateIdValueObject(
        '123e4567-e89b-12d3-a456-426614174001',
      ),
      aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
      eventType: new EventTypeValueObject('UserCreatedEvent'),
      payload: new EventPayloadValueObject({ foo: 'bar' }),
      timestamp: new EventTimestampValueObject(
        new Date('2024-01-01T10:00:00Z'),
      ),
    };
  };

  it('should emit EventCreatedEvent on creation by default', () => {
    const props = createProps();

    const aggregate = new EventAggregate(props);
    const events = aggregate.getUncommittedEvents();

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(EventCreatedEvent);

    const event = events[0] as EventCreatedEvent;
    expect(event.aggregateId).toBe(props.id.value);
    expect(event.aggregateType).toBe(EventAggregate.name);
    expect(event.eventType).toBe(EventCreatedEvent.name);
    expect(event.data).toEqual(aggregate.toPrimitives());
  });

  it('should not emit EventCreatedEvent when generateEvent flag is false', () => {
    const props = createProps();

    const aggregate = new EventAggregate(props, false);

    expect(aggregate.getUncommittedEvents()).toHaveLength(0);
  });

  it('should expose value objects through getters', () => {
    const props = createProps();
    const aggregate = new EventAggregate(props, false);

    expect(aggregate.id).toBeInstanceOf(EventUuidValueObject);
    expect(aggregate.eventType).toBeInstanceOf(EventTypeValueObject);
    expect(aggregate.aggregateType).toBeInstanceOf(
      EventAggregateTypeValueObject,
    );
    expect(aggregate.aggregateId).toBeInstanceOf(EventAggregateIdValueObject);
    expect(aggregate.payload).toBeInstanceOf(EventPayloadValueObject);
    expect(aggregate.timestamp).toBeInstanceOf(EventTimestampValueObject);
  });

  it('should convert to primitives correctly', () => {
    const props = createProps();
    const aggregate = new EventAggregate(props, false);

    const primitives = aggregate.toPrimitives();

    expect(primitives).toEqual({
      id: props.id.value,
      eventType: props.eventType.value,
      aggregateType: props.aggregateType.value,
      aggregateId: props.aggregateId.value,
      payload: props.payload.value,
      timestamp: props.timestamp.value,
    });
  });

  it('should allow creating from factory without duplicating event', () => {
    const props = createProps();
    const factory = new EventAggregateFactory();

    const aggregate = factory.create(props);
    aggregate.commit();

    expect(aggregate.getUncommittedEvents()).toHaveLength(0);
  });
});
