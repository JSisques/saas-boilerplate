import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate/event-aggregate.factory';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventAggregateFactory', () => {
  let factory: EventAggregateFactory;

  beforeEach(() => {
    factory = new EventAggregateFactory();
  });

  const createAggregateProps = () => ({
    id: new EventUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
    aggregateId: new EventAggregateIdValueObject(
      '123e4567-e89b-12d3-a456-426614174001',
    ),
    aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
    eventType: new EventTypeValueObject('UserCreatedEvent'),
    payload: new EventPayloadValueObject({ foo: 'bar' }),
    timestamp: new EventTimestampValueObject(new Date('2024-01-01T10:00:00Z')),
  });

  const createPrimitives = () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    aggregateType: 'UserAggregate',
    eventType: 'UserCreatedEvent',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
  });

  it('should create an EventAggregate from domain props', () => {
    const props = createAggregateProps();

    const aggregate = factory.create(props);

    expect(aggregate).toBeInstanceOf(EventAggregate);
    expect(aggregate.id.value).toBe(props.id.value);
    expect(aggregate.aggregateId.value).toBe(props.aggregateId.value);
    expect(aggregate.aggregateType.value).toBe(props.aggregateType.value);
    expect(aggregate.eventType.value).toBe(props.eventType.value);
    expect(aggregate.payload?.value).toEqual(props.payload.value);
    expect(aggregate.timestamp.value).toEqual(props.timestamp.value);
  });

  it('should create an EventAggregate from primitives', () => {
    const primitives = createPrimitives();

    const aggregate = factory.fromPrimitives(primitives);

    expect(aggregate).toBeInstanceOf(EventAggregate);
    expect(aggregate.id.value).toBe(primitives.id);
    expect(aggregate.aggregateType.value).toBe(primitives.aggregateType);
    expect(aggregate.aggregateId.value).toBe(primitives.aggregateId);
    expect(aggregate.eventType.value).toBe(primitives.eventType);
    expect(aggregate.payload?.value).toEqual(primitives.payload);
    expect(aggregate.timestamp.value).toEqual(primitives.timestamp);
  });

  it('should emit creation event when rebuilding from primitives', () => {
    const primitives = createPrimitives();

    const aggregate = factory.fromPrimitives(primitives);

    expect(aggregate.getUncommittedEvents()).toHaveLength(1);
    aggregate.commit();
    expect(aggregate.getUncommittedEvents()).toHaveLength(0);
  });
});
