import { SubscriptionUpdatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-updated/subscription-updated.event';
import { ISubscriptionEventData } from '@/shared/domain/events/billing-context/subscription/interfaces/subscription-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('SubscriptionUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'SubscriptionAggregate',
    eventType: 'SubscriptionUpdatedEvent',
    isReplay: false,
  });

  const createPartialSubscriptionData = (): Partial<
    Omit<ISubscriptionEventData, 'id'>
  > => ({
    status: 'active',
    endDate: new Date('2024-03-01T00:00:00Z'),
    renewalMethod: 'automatic',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionData();

    const event = new SubscriptionUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionData();

    const event = new SubscriptionUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial subscription data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionData();

    const event = new SubscriptionUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe(data.status);
    expect(event.data.renewalMethod).toBe(data.renewalMethod);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { status: 'only-status' };

    const event = new SubscriptionUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('only-status');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionData();

    const event1 = new SubscriptionUpdatedEvent(metadata, data);
    const event2 = new SubscriptionUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
