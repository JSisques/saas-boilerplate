import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';
import { ITenantEventData } from '@/shared/domain/events/tenant-context/tenants/interfaces/tenant-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('TenantUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'TenantAggregate',
    eventType: 'TenantUpdatedEvent',
    isReplay: false,
  });

  const createPartialTenantData = (): Partial<
    Omit<ITenantEventData, 'id'>
  > => ({
    name: 'Updated Tenant Name',
    description: 'Updated description',
    status: 'active',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialTenantData();

    const event = new TenantUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialTenantData();

    const event = new TenantUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial tenant data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialTenantData();

    const event = new TenantUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.name).toBe(data.name);
    expect(event.data.status).toBe(data.status);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { name: 'Only Name' };

    const event = new TenantUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.name).toBe('Only Name');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialTenantData();

    const event1 = new TenantUpdatedEvent(metadata, data);
    const event2 = new TenantUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
