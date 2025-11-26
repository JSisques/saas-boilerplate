import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ISubscriptionEventData } from '@/shared/domain/events/billing-context/subscription/interfaces/subscription-event-data.interface';
import { SubscriptionCancelledEvent } from '@/shared/domain/events/billing-context/subscription/subscription-cancelled/subscription-cancelled.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('SubscriptionCancelledEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'SubscriptionAggregate',
    eventType: 'SubscriptionCancelledEvent',
    isReplay: false,
  });

  const createSubscriptionData = (): ISubscriptionEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    tenantId: '123e4567-e89b-12d3-a456-426614174001',
    planId: '123e4567-e89b-12d3-a456-426614174002',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-02-01T00:00:00Z'),
    trialEndDate: null,
    status: 'cancelled',
    stripeSubscriptionId: 'sub_1234567890',
    stripeCustomerId: 'cus_1234567890',
    renewalMethod: 'manual',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createSubscriptionData();

    const event = new SubscriptionCancelledEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createSubscriptionData();

    const event = new SubscriptionCancelledEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the subscription data correctly', () => {
    const metadata = createMetadata();
    const data = createSubscriptionData();

    const event = new SubscriptionCancelledEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('cancelled');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createSubscriptionData();

    const event1 = new SubscriptionCancelledEvent(metadata, data);
    const event2 = new SubscriptionCancelledEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
