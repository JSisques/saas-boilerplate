import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantEventData } from '@/shared/domain/events/tenant-context/tenants/interfaces/tenant-event-data.interface';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('TenantDeletedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'TenantAggregate',
    eventType: 'TenantDeletedEvent',
    isReplay: false,
  });

  const now = new Date();

  const createTenantData = (): ITenantEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Deleted Tenant',
    slug: 'deleted-tenant',
    description: null,
    websiteUrl: null,
    logoUrl: null,
    faviconUrl: null,
    primaryColor: null,
    secondaryColor: null,
    status: 'deleted',
    email: null,
    phoneNumber: null,
    phoneCode: null,
    address: null,
    city: null,
    state: null,
    country: null,
    postalCode: null,
    timezone: null,
    locale: null,
    maxUsers: null,
    maxStorage: null,
    maxApiCalls: null,
    createdAt: now,
    updatedAt: now,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event = new TenantDeletedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event = new TenantDeletedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the tenant data correctly', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event = new TenantDeletedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('deleted');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event1 = new TenantDeletedEvent(metadata, data);
    const event2 = new TenantDeletedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
