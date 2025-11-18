import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';
import { ISubscriptionPlanEventData } from '@/shared/domain/events/billing-context/subscription-plan/interfaces/subscription-plan-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('SubscriptionPlanDeletedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'SubscriptionPlanAggregate',
    eventType: 'SubscriptionPlanDeletedEvent',
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
    trialPeriodDays: null,
    isActive: false,
    features: null,
    limits: null,
    stripePriceId: null,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event = new SubscriptionPlanDeletedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event = new SubscriptionPlanDeletedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the subscription plan data correctly', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event = new SubscriptionPlanDeletedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.isActive).toBe(false);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createSubscriptionPlanData();

    const event1 = new SubscriptionPlanDeletedEvent(metadata, data);
    const event2 = new SubscriptionPlanDeletedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

