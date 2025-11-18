import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';
import { ISubscriptionPlanEventData } from '@/shared/domain/events/billing-context/subscription-plan/interfaces/subscription-plan-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('SubscriptionPlanCreatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'SubscriptionPlanAggregate',
    eventType: 'SubscriptionPlanCreatedEvent',
    isReplay: false,
  });

  const createSubscriptionPlanData = (): ISubscriptionPlanEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Basic Plan',
    slug: 'basic-plan',
    type: 'basic',
    description: 'A basic subscription plan',
    priceMonthly: 9.99,
    priceYearly: 99.99,
    currency: 'USD',
    interval: 'month',
    intervalCount: 1,
    trialPeriodDays: 7,
    isActive: true,
    features: { storage: '10GB', users: 5 },
    limits: { apiCalls: 1000 },
    stripePriceId: 'price_1234567890',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event = new SubscriptionPlanCreatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event = new SubscriptionPlanCreatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the subscription plan data correctly', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event = new SubscriptionPlanCreatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.name).toBe(data.name);
    expect(event.data.slug).toBe(data.slug);
    expect(event.data.priceMonthly).toBe(data.priceMonthly);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event1 = new SubscriptionPlanCreatedEvent(metadata, data);
    const event2 = new SubscriptionPlanCreatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

