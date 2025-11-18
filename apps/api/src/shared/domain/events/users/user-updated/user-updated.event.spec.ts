import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { IUserEventData } from '@/shared/domain/events/users/interfaces/user-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('UserUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'UserAggregate',
    eventType: 'UserUpdatedEvent',
    isReplay: false,
  });

  const createPartialUserData = (): Partial<Omit<IUserEventData, 'id'>> => ({
    name: 'Jane',
    lastName: 'Smith',
    bio: 'Updated bio',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialUserData();

    const event = new UserUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialUserData();

    const event = new UserUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial user data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialUserData();

    const event = new UserUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.name).toBe(data.name);
    expect(event.data.bio).toBe(data.bio);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { name: 'Only Name' };

    const event = new UserUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.name).toBe('Only Name');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialUserData();

    const event1 = new UserUpdatedEvent(metadata, data);
    const event2 = new UserUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
