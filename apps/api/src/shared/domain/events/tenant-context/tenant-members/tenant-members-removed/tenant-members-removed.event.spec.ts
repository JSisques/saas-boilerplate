import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantMemberEventData } from '@/shared/domain/events/tenant-context/tenant-members/interfaces/tenant-members-event-data.interface';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('TenantMemberRemovedEvent', () => {
  const now = new Date();
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'TenantMemberAggregate',
    eventType: 'TenantMemberRemovedEvent',
    isReplay: false,
  });

  const createTenantMemberData = (): ITenantMemberEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    tenantId: '123e4567-e89b-12d3-a456-426614174001',
    userId: '123e4567-e89b-12d3-a456-426614174002',
    role: 'member',
    createdAt: now,
    updatedAt: now,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event = new TenantMemberRemovedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event = new TenantMemberRemovedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the tenant member data correctly', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event = new TenantMemberRemovedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.tenantId).toBe(data.tenantId);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createTenantMemberData();

    const event1 = new TenantMemberRemovedEvent(metadata, data);
    const event2 = new TenantMemberRemovedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
