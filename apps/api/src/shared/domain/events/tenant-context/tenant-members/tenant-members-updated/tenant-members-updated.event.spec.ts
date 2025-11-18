import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { ITenantMemberEventData } from '@/shared/domain/events/tenant-context/tenant-members/interfaces/tenant-members-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('TenantMemberUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'TenantMemberAggregate',
    eventType: 'TenantMemberUpdatedEvent',
    isReplay: false,
  });

  const createPartialTenantMemberData = (): Partial<
    Omit<ITenantMemberEventData, 'id'>
  > => ({
    role: 'admin',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialTenantMemberData();

    const event = new TenantMemberUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialTenantMemberData();

    const event = new TenantMemberUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial tenant member data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialTenantMemberData();

    const event = new TenantMemberUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.role).toBe(data.role);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { role: 'only-role' };

    const event = new TenantMemberUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.role).toBe('only-role');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialTenantMemberData();

    const event1 = new TenantMemberUpdatedEvent(metadata, data);
    const event2 = new TenantMemberUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

