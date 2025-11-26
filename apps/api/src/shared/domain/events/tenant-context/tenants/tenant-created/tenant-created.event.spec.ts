import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { ITenantEventData } from '@/shared/domain/events/tenant-context/tenants/interfaces/tenant-event-data.interface';
import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('TenantCreatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'TenantAggregate',
    eventType: 'TenantCreatedEvent',
    isReplay: false,
  });

  const now = new Date();

  const createTenantData = (): ITenantEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Tenant',
    slug: 'test-tenant',
    description: 'A test tenant',
    websiteUrl: 'https://example.com',
    logoUrl: 'https://example.com/logo.png',
    faviconUrl: 'https://example.com/favicon.ico',
    primaryColor: '#FF0000',
    secondaryColor: '#00FF00',
    status: 'active',
    email: 'tenant@example.com',
    phoneNumber: '+1234567890',
    phoneCode: '+1',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'US',
    postalCode: '10001',
    timezone: 'America/New_York',
    locale: 'en-US',
    maxUsers: 100,
    maxStorage: 1000,
    maxApiCalls: 10000,
    createdAt: now,
    updatedAt: now,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event = new TenantCreatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event = new TenantCreatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the tenant data correctly', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event = new TenantCreatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.id).toBe(data.id);
    expect(event.data.name).toBe(data.name);
    expect(event.data.slug).toBe(data.slug);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createTenantData();

    const event1 = new TenantCreatedEvent(metadata, data);
    const event2 = new TenantCreatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
