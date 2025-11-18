import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { ITenantMemberEventData } from '@/shared/domain/events/tenant-context/tenant-members/interfaces/tenant-members-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('TenantMemberAddedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'TenantMemberAggregate',
    eventType: 'TenantMemberAddedEvent',
    isReplay: false,
  });

  const createTenantMemberData = (): ITenantMemberEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    tenantId: '123e4567-e89b-12d3-a456-426614174001',
    userId: '123e4567-e89b-12d3-a456-426614174002',
    role: 'admin',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event = new TenantMemberAddedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event = new TenantMemberAddedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the tenant member data correctly', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event = new TenantMemberAddedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.tenantId).toBe(data.tenantId);
    expect(event.data.userId).toBe(data.userId);
    expect(event.data.role).toBe(data.role);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event1 = new TenantMemberAddedEvent(metadata, data);
    const event2 = new TenantMemberAddedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
