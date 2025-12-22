import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { ITenantCreateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-create/tenant-create.dto';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate/tenant-aggregate.factory';
import { TenantPrimitives } from '@/tenant-context/tenants/domain/primitives/tenant.primitives';
import { TenantAddressValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-address/tenant-address.vo';
import { TenantCityValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-city/tenant-city.vo';
import { TenantCountryValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-country/tenant-country.vo';
import { TenantDescriptionValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-description/tenant-description.vo';
import { TenantEmailValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-email/tenant-email.vo';
import { TenantFaviconUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-favicon-url/tenant-favicon-url.vo';
import { TenantLocaleValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-locale/tenant-locale.vo';
import { TenantLogoUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-logo-url/tenant-logo-url.vo';
import { TenantMaxApiCallsValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-api-calls/tenant-max-api-calls.vo';
import { TenantMaxStorageValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-storage/tenant-max-storage.vo';
import { TenantMaxUsersValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-users/tenant-max-users.vo';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantPhoneCodeValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-phone-code/tenant-phone-code.vo';
import { TenantPhoneNumberValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-phone-number/tenant-phone-number.vo';
import { TenantPostalCodeValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-postal-code/tenant-postal-code.vo';
import { TenantPrimaryColorValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-primary-color/tenant-primary-color.vo';
import { TenantSecondaryColorValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-secondary-color/tenant-secondary-color.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStateValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-state/tenant-state.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { TenantTimezoneValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-timezone/tenant-timezone.vo';
import { TenantWebsiteUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-website-url/tenant-website-url.vo';

describe('TenantAggregateFactory', () => {
  let factory: TenantAggregateFactory;

  beforeEach(() => {
    factory = new TenantAggregateFactory();
  });

  describe('create', () => {
    it('should create a TenantAggregate from DTO with all fields and generate event by default', () => {
      const dto: ITenantCreateDto = {
        id: new TenantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        name: new TenantNameValueObject('Test Tenant'),
        slug: new TenantSlugValueObject('test-tenant'),
        description: new TenantDescriptionValueObject('Test description'),
        websiteUrl: new TenantWebsiteUrlValueObject('https://example.com'),
        logoUrl: new TenantLogoUrlValueObject('https://example.com/logo.png'),
        faviconUrl: new TenantFaviconUrlValueObject(
          'https://example.com/favicon.ico',
        ),
        primaryColor: new TenantPrimaryColorValueObject('#FF0000'),
        secondaryColor: new TenantSecondaryColorValueObject('#00FF00'),
        status: new TenantStatusValueObject(TenantStatusEnum.ACTIVE),
        email: new TenantEmailValueObject('test@example.com'),
        phoneNumber: new TenantPhoneNumberValueObject('1234567890'),
        phoneCode: new TenantPhoneCodeValueObject('+1'),
        address: new TenantAddressValueObject('123 Main St'),
        city: new TenantCityValueObject('New York'),
        state: new TenantStateValueObject('NY'),
        country: new TenantCountryValueObject('USA'),
        postalCode: new TenantPostalCodeValueObject('10001'),
        timezone: new TenantTimezoneValueObject('America/New_York'),
        locale: new TenantLocaleValueObject('en-US'),
        maxUsers: new TenantMaxUsersValueObject(100),
        maxStorage: new TenantMaxStorageValueObject(1000),
        maxApiCalls: new TenantMaxApiCallsValueObject(10000),
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(TenantAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.slug.value).toBe(dto.slug.value);
      expect(aggregate.status.value).toBe(dto.status.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(TenantCreatedEvent);
    });

    it('should create a TenantAggregate from DTO without generating event when generateEvent is false', () => {
      const dto: ITenantCreateDto = {
        id: new TenantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        name: new TenantNameValueObject('Test Tenant'),
        slug: new TenantSlugValueObject('test-tenant'),
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: new TenantStatusValueObject(TenantStatusEnum.ACTIVE),
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
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(TenantAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a TenantAggregate from DTO with null optional fields', () => {
      const dto: ITenantCreateDto = {
        id: new TenantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        name: new TenantNameValueObject('Test Tenant'),
        slug: new TenantSlugValueObject('test-tenant'),
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: new TenantStatusValueObject(TenantStatusEnum.ACTIVE),
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
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(TenantAggregate);
      expect(aggregate.description).toBeNull();
      expect(aggregate.email).toBeNull();
      expect(aggregate.maxUsers).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a TenantAggregate from primitives with all fields', () => {
      const primitives: TenantPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: 'Test description',
        websiteUrl: 'https://example.com',
        logoUrl: 'https://example.com/logo.png',
        faviconUrl: 'https://example.com/favicon.ico',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        status: TenantStatusEnum.ACTIVE,
        email: 'test@example.com',
        phoneNumber: '1234567890',
        phoneCode: '+1',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        timezone: 'America/New_York',
        locale: 'en-US',
        maxUsers: 100,
        maxStorage: 1000,
        maxApiCalls: 10000,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(TenantAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.slug.value).toBe(primitives.slug);
      expect(aggregate.description?.value).toBe(primitives.description);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.email?.value).toBe(primitives.email);
      expect(aggregate.maxUsers?.value).toBe(primitives.maxUsers);
    });

    it('should create a TenantAggregate from primitives with null optional fields', () => {
      const primitives: TenantPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
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
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(TenantAggregate);
      expect(aggregate.description).toBeNull();
      expect(aggregate.email).toBeNull();
      expect(aggregate.maxUsers).toBeNull();
    });
  });
});
