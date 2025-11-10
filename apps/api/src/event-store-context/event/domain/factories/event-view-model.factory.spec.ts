import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model.factory';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventViewModelFactory', () => {
  let factory: EventViewModelFactory;

  beforeEach(() => {
    factory = new EventViewModelFactory();
    jest.useFakeTimers().setSystemTime(new Date('2024-01-02T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createAggregate = () =>
    new EventAggregate(
      {
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
      },
      false,
    );

  const createPrimitives = () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
  });

  it('should create view model from DTO', () => {
    const dto = {
      ...createPrimitives(),
      createdAt: new Date('2024-01-02T12:00:00Z'),
      updatedAt: new Date('2024-01-02T12:30:00Z'),
    };

    const viewModel = factory.create(dto);

    expect(viewModel).toBeInstanceOf(EventViewModel);
    expect(viewModel.id).toBe(dto.id);
    expect(viewModel.eventType).toBe(dto.eventType);
    expect(viewModel.aggregateType).toBe(dto.aggregateType);
    expect(viewModel.aggregateId).toBe(dto.aggregateId);
    expect(viewModel.payload).toEqual(dto.payload);
    expect(viewModel.timestamp).toEqual(dto.timestamp);
    expect(viewModel.createdAt).toEqual(dto.createdAt);
    expect(viewModel.updatedAt).toEqual(dto.updatedAt);
  });

  it('should create view model from primitives using current timestamp for metadata fields', () => {
    const primitives = createPrimitives();

    const viewModel = factory.fromPrimitives(primitives);

    expect(viewModel.id).toBe(primitives.id);
    expect(viewModel.eventType).toBe(primitives.eventType);
    expect(viewModel.aggregateType).toBe(primitives.aggregateType);
    expect(viewModel.aggregateId).toBe(primitives.aggregateId);
    expect(viewModel.payload).toEqual(primitives.payload);
    expect(viewModel.timestamp).toEqual(primitives.timestamp);
    expect(viewModel.createdAt).toEqual(new Date('2024-01-02T12:00:00Z'));
    expect(viewModel.updatedAt).toEqual(new Date('2024-01-02T12:00:00Z'));
  });

  it('should create view model from aggregate using current timestamp for metadata fields', () => {
    const aggregate = createAggregate();

    const viewModel = factory.fromAggregate(aggregate);

    expect(viewModel.id).toBe(aggregate.id.value);
    expect(viewModel.eventType).toBe(aggregate.eventType.value);
    expect(viewModel.aggregateType).toBe(aggregate.aggregateType.value);
    expect(viewModel.aggregateId).toBe(aggregate.aggregateId.value);
    expect(viewModel.payload).toEqual(aggregate.payload?.value);
    expect(viewModel.timestamp).toEqual(aggregate.timestamp.value);
    expect(viewModel.createdAt).toEqual(new Date('2024-01-02T12:00:00Z'));
    expect(viewModel.updatedAt).toEqual(new Date('2024-01-02T12:00:00Z'));
  });
});
