import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';
import { IEventEventData } from '@/shared/domain/events/event-store/interfaces/event-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('EventCreatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'EventAggregate',
    eventType: 'EventCreatedEvent',
    isReplay: false,
  });

  const createEventData = (): IEventEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { name: 'John Doe', email: 'john@example.com' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createEventData();

    const event = new EventCreatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createEventData();

    const event = new EventCreatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the event data correctly', () => {
    const metadata = createMetadata();
    const data = createEventData();

    const event = new EventCreatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.eventType).toBe(data.eventType);
    expect(event.data.aggregateType).toBe(data.aggregateType);
    expect(event.data.aggregateId).toBe(data.aggregateId);
    expect(event.data.payload).toEqual(data.payload);
    expect(event.data.timestamp).toEqual(data.timestamp);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createEventData();

    const event1 = new EventCreatedEvent(metadata, data);
    const event2 = new EventCreatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

