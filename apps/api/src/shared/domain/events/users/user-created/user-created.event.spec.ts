import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { IUserEventData } from '@/shared/domain/events/users/interfaces/user-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('UserCreatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'UserAggregate',
    eventType: 'UserCreatedEvent',
    isReplay: false,
  });

  const createUserData = (): IUserEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    lastName: 'Doe',
    name: 'John',
    role: 'user',
    status: 'active',
    userName: 'johndoe',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createUserData();

    const event = new UserCreatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createUserData();

    const event = new UserCreatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the user data correctly', () => {
    const metadata = createMetadata();
    const data = createUserData();

    const event = new UserCreatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.name).toBe(data.name);
    expect(event.data.userName).toBe(data.userName);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createUserData();

    const event1 = new UserCreatedEvent(metadata, data);
    const event2 = new UserCreatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
