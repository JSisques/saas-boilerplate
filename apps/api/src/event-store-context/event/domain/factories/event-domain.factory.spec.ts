import { DomainEventFactory } from '@/event-store-context/event/domain/factories/event-domain.factory';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';

describe('DomainEventFactory', () => {
  let factory: DomainEventFactory;

  beforeEach(() => {
    factory = new DomainEventFactory();
  });

  it('should create a registered domain event instance', () => {
    const metadata = {
      aggregateId: '123e4567-e89b-12d3-a456-426614174000',
      aggregateType: 'UserAggregate',
      eventType: EventCreatedEvent.name,
      isReplay: true,
    };
    const data = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateType: 'UserAggregate',
      aggregateId: '123e4567-e89b-12d3-a456-426614174000',
      payload: { foo: 'bar' },
      timestamp: new Date('2024-01-01T10:00:00Z'),
    };

    const event = factory.create(EventCreatedEvent.name, metadata, data);

    expect(event).toBeInstanceOf(EventCreatedEvent);
    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
    expect(event.data).toEqual(data);
    expect(event.isReplay).toBe(true);
  });

  it('should throw when event type is not registered', () => {
    const metadata = {
      aggregateId: '123e4567-e89b-12d3-a456-426614174000',
      aggregateType: 'UserAggregate',
      eventType: 'UnknownEvent',
    };

    expect(() => factory.create('UnknownEvent', metadata, {})).toThrowError(
      'Unsupported eventType for replay: UnknownEvent',
    );
  });
});
