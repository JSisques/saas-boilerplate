import { SubscriptionPlanUpdatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event';
import { ISubscriptionPlanEventData } from '@/shared/domain/events/billing-context/subscription-plan/interfaces/subscription-plan-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('SubscriptionPlanUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'SubscriptionPlanAggregate',
    eventType: 'SubscriptionPlanUpdatedEvent',
    isReplay: false,
  });

  const createPartialSubscriptionPlanData = (): Partial<
    Omit<ISubscriptionPlanEventData, 'id'>
  > => ({
    name: 'Updated Plan Name',
    priceMonthly: 19.99,
    isActive: true,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionPlanData();

    const event = new SubscriptionPlanUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionPlanData();

    const event = new SubscriptionPlanUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial subscription plan data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionPlanData();

    const event = new SubscriptionPlanUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.name).toBe(data.name);
    expect(event.data.priceMonthly).toBe(data.priceMonthly);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { priceMonthly: 29.99 };

    const event = new SubscriptionPlanUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.priceMonthly).toBe(29.99);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialSubscriptionPlanData();

    const event1 = new SubscriptionPlanUpdatedEvent(metadata, data);
    const event2 = new SubscriptionPlanUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

