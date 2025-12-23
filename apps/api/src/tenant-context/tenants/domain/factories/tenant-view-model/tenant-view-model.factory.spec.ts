import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { ITenantCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-create/tenant-create-view-model.dto';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model/tenant-view-model.factory';
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
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';

describe('TenantViewModelFactory', () => {
  let factory: TenantViewModelFactory;

  beforeEach(() => {
    factory = new TenantViewModelFactory();
  });

  describe('create', () => {
    it('should create a TenantViewModel from DTO with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const dto: ITenantCreateViewModelDto = {
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
        tenantMembers: [],
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.slug).toBe(dto.slug);
      expect(viewModel.description).toBe(dto.description);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.email).toBe(dto.email);
      expect(viewModel.maxUsers).toBe(dto.maxUsers);
    });

    it('should create a TenantViewModel from DTO with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const dto: ITenantCreateViewModelDto = {
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
        tenantMembers: [],
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.description).toBeNull();
      expect(viewModel.email).toBeNull();
      expect(viewModel.maxUsers).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a TenantViewModel from primitives with all fields', () => {
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

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.slug).toBe(primitives.slug);
      expect(viewModel.description).toBe(primitives.description);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.email).toBe(primitives.email);
      expect(viewModel.maxUsers).toBe(primitives.maxUsers);
      expect(viewModel.tenantMembers).toEqual([]);
    });

    it('should create a TenantViewModel from primitives with null optional fields', () => {
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

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.description).toBeNull();
      expect(viewModel.email).toBeNull();
      expect(viewModel.maxUsers).toBeNull();
    });
  });

  describe('fromAggregate', () => {
    it('should create a TenantViewModel from aggregate with all fields', () => {
      const aggregate = new TenantAggregate(
        {
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
          locale: new TenantLocaleValueObject('en', {
            validateExistence: false,
          }),
          maxUsers: new TenantMaxUsersValueObject(100),
          maxStorage: new TenantMaxStorageValueObject(1000),
          maxApiCalls: new TenantMaxApiCallsValueObject(10000),
          createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
          updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.slug).toBe(aggregate.slug.value);
      expect(viewModel.description).toBe(aggregate.description?.value || null);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.email).toBe(aggregate.email?.value || null);
      expect(viewModel.maxUsers).toBe(aggregate.maxUsers?.value || null);
      expect(viewModel.tenantMembers).toEqual([]);
    });

    it('should create a TenantViewModel from aggregate with null optional fields', () => {
      const aggregate = new TenantAggregate(
        {
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
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.description).toBeNull();
      expect(viewModel.email).toBeNull();
      expect(viewModel.maxUsers).toBeNull();
    });
  });
});
