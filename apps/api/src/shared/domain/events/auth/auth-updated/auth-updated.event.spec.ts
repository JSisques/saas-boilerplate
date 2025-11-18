import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';
import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('AuthUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'AuthAggregate',
    eventType: 'AuthUpdatedEvent',
    isReplay: false,
  });

  const createPartialAuthData = (): Partial<Omit<IAuthEventData, 'id'>> => ({
    email: 'updated@example.com',
    emailVerified: true,
    twoFactorEnabled: true,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialAuthData();

    const event = new AuthUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialAuthData();

    const event = new AuthUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial auth data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialAuthData();

    const event = new AuthUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.email).toBe(data.email);
    expect(event.data.twoFactorEnabled).toBe(true);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { email: 'only-email@example.com' };

    const event = new AuthUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.email).toBe('only-email@example.com');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialAuthData();

    const event1 = new AuthUpdatedEvent(metadata, data);
    const event2 = new AuthUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
