import { AuthUpdatedLastLoginAtEvent } from '@/shared/domain/events/auth/auth-updated-last-login-at/auth-updated-last-login-at.event';
import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('AuthUpdatedLastLoginAtEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'AuthAggregate',
    eventType: 'AuthUpdatedLastLoginAtEvent',
    isReplay: false,
  });

  const createAuthData = (): IAuthEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    email: 'test@example.com',
    emailVerified: true,
    phoneNumber: null,
    lastLoginAt: new Date('2024-01-01T12:00:00Z'),
    password: 'hashed-password',
    provider: 'local',
    providerId: null,
    twoFactorEnabled: false,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event = new AuthUpdatedLastLoginAtEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event = new AuthUpdatedLastLoginAtEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the auth data correctly', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event = new AuthUpdatedLastLoginAtEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.lastLoginAt).toEqual(data.lastLoginAt);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createAuthData();

    const event1 = new AuthUpdatedLastLoginAtEvent(metadata, data);
    const event2 = new AuthUpdatedLastLoginAtEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});


