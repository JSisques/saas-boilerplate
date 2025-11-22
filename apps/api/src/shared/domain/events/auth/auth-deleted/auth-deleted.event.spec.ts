import { AuthDeletedEvent } from '@/shared/domain/events/auth/auth-deleted/auth-deleted.event';
import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('AuthDeletedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'AuthAggregate',
    eventType: 'AuthDeletedEvent',
    isReplay: false,
  });

  const createAuthData = (): IAuthEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    email: 'test@example.com',
    emailVerified: true,
    phoneNumber: '+1234567890',
    lastLoginAt: new Date('2024-01-01T10:00:00Z'),
    password: 'hashed-password',
    provider: 'local',
    providerId: null,
    twoFactorEnabled: false,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event = new AuthDeletedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event = new AuthDeletedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
    expect(event.isReplay).toBe(metadata.isReplay);
  });

  it('should store the auth data correctly', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event = new AuthDeletedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.userId).toBe(data.userId);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event1 = new AuthDeletedEvent(metadata, data);
    const event2 = new AuthDeletedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });

  it('should set ocurredAt timestamp', () => {
    const metadata = createMetadata();
    const data = createAuthData();
    const beforeCreation = new Date();

    const event = new AuthDeletedEvent(metadata, data);

    const afterCreation = new Date();
    expect(event.ocurredAt).toBeInstanceOf(Date);
    expect(event.ocurredAt.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime(),
    );
    expect(event.ocurredAt.getTime()).toBeLessThanOrEqual(
      afterCreation.getTime(),
    );
  });
});
