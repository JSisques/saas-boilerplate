import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { ITenantCreateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-create/tenant-create.dto';
import { ITenantUpdateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-update/tenant-update.dto';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
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

describe('TenantAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): TenantAggregate => {
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

    return new TenantAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a TenantAggregate with all fields', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(TenantAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.name.value).toBe('Test Tenant');
      expect(aggregate.slug.value).toBe('test-tenant');
      expect(aggregate.description?.value).toBe('Test description');
      expect(aggregate.status.value).toBe(TenantStatusEnum.ACTIVE);
    });

    it('should create a TenantAggregate with null optional fields', () => {
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
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = new TenantAggregate(dto, false);

      expect(aggregate.description).toBeNull();
      expect(aggregate.websiteUrl).toBeNull();
      expect(aggregate.email).toBeNull();
    });

    it('should generate TenantCreatedEvent by default', () => {
      const aggregate = createBaseAggregate(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantCreatedEvent);

      const event = events[0] as TenantCreatedEvent;
      expect(event.aggregateId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(event.data.name).toBe('Test Tenant');
    });

    it('should not generate TenantCreatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update name when new value is provided', () => {
      const aggregate = createBaseAggregate(false);
      const originalName = aggregate.name.value;
      const newName = new TenantNameValueObject('Updated Tenant');

      aggregate.update({ name: newName }, false);

      expect(aggregate.name.value).toBe('Updated Tenant');
      expect(aggregate.name.value).not.toBe(originalName);
    });

    it('should update slug when new value is provided', () => {
      const aggregate = createBaseAggregate(false);
      const newSlug = new TenantSlugValueObject('updated-tenant');

      aggregate.update({ slug: newSlug }, false);

      expect(aggregate.slug.value).toBe('updated-tenant');
    });

    it('should update status when new value is provided', () => {
      const aggregate = createBaseAggregate(false);
      const newStatus = new TenantStatusValueObject(TenantStatusEnum.INACTIVE);

      aggregate.update({ status: newStatus }, false);

      expect(aggregate.status.value).toBe(TenantStatusEnum.INACTIVE);
    });

    it('should update optional fields when new values are provided', () => {
      const aggregate = createBaseAggregate(false);
      const newDescription = new TenantDescriptionValueObject(
        'Updated description',
      );
      const newEmail = new TenantEmailValueObject('updated@example.com');

      aggregate.update(
        {
          description: newDescription,
          email: newEmail,
        },
        false,
      );

      expect(aggregate.description?.value).toBe('Updated description');
      expect(aggregate.email?.value).toBe('updated@example.com');
    });

    it('should not update fields when undefined is provided', () => {
      const aggregate = createBaseAggregate(false);
      const originalName = aggregate.name.value;
      const originalSlug = aggregate.slug.value;

      aggregate.update({}, false);

      expect(aggregate.name.value).toBe(originalName);
      expect(aggregate.slug.value).toBe(originalSlug);
    });

    it('should generate TenantUpdatedEvent by default', () => {
      const aggregate = createBaseAggregate(false);
      aggregate.clearUncommittedEvents();

      aggregate.update({ name: new TenantNameValueObject('Updated') }, true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantUpdatedEvent);
    });

    it('should not generate TenantUpdatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);
      aggregate.clearUncommittedEvents();

      aggregate.update({ name: new TenantNameValueObject('Updated') }, false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should generate TenantDeletedEvent by default', () => {
      const aggregate = createBaseAggregate(false);
      aggregate.clearUncommittedEvents();

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantDeletedEvent);

      const event = events[0] as TenantDeletedEvent;
      expect(event.aggregateId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should not generate TenantDeletedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);
      aggregate.clearUncommittedEvents();

      aggregate.delete(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives with all fields', () => {
      const aggregate = createBaseAggregate(false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(primitives.name).toBe('Test Tenant');
      expect(primitives.slug).toBe('test-tenant');
      expect(primitives.description).toBe('Test description');
      expect(primitives.status).toBe(TenantStatusEnum.ACTIVE);
      expect(primitives.email).toBe('test@example.com');
      expect(primitives.maxUsers).toBe(100);
    });

    it('should convert aggregate to primitives with null optional fields', () => {
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

      const aggregate = new TenantAggregate(dto, false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.description).toBeNull();
      expect(primitives.email).toBeNull();
      expect(primitives.maxUsers).toBeNull();
    });
  });
});
