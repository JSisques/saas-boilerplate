import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate/tenant-aggregate.factory';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantTypeormEntity } from '@/tenant-context/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { TenantTypeormMapper } from '@/tenant-context/tenants/infrastructure/database/typeorm/mappers/tenant-typeorm.mapper';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';

describe('TenantTypeormMapper', () => {
  let mapper: TenantTypeormMapper;
  let mockTenantAggregateFactory: jest.Mocked<TenantAggregateFactory>;

  beforeEach(() => {
    mockTenantAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantAggregateFactory>;

    mapper = new TenantTypeormMapper(mockTenantAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantTypeormEntity();
      typeormEntity.id = tenantId;
      typeormEntity.name = 'Test Tenant';
      typeormEntity.slug = 'test-tenant';
      typeormEntity.description = 'Test description';
      typeormEntity.websiteUrl = 'https://example.com';
      typeormEntity.logoUrl = 'https://example.com/logo.png';
      typeormEntity.faviconUrl = 'https://example.com/favicon.ico';
      typeormEntity.primaryColor = '#FF0000';
      typeormEntity.secondaryColor = '#00FF00';
      typeormEntity.status = TenantStatusEnum.ACTIVE;
      typeormEntity.email = 'test@example.com';
      typeormEntity.phoneNumber = '123456789';
      typeormEntity.phoneCode = '+1';
      typeormEntity.address = '123 Main St';
      typeormEntity.city = 'New York';
      typeormEntity.state = 'NY';
      typeormEntity.country = 'USA';
      typeormEntity.postalCode = '10001';
      typeormEntity.timezone = 'America/New_York';
      typeormEntity.locale = 'en-US';
      typeormEntity.maxUsers = 100;
      typeormEntity.maxStorage = 1000;
      typeormEntity.maxApiCalls = 10000;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockTenantAggregate = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockTenantAggregate);
      expect(mockTenantAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: tenantId,
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
        phoneNumber: '123456789',
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
        createdAt: now,
        updatedAt: now,
      });
      expect(mockTenantAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantTypeormEntity();
      typeormEntity.id = tenantId;
      typeormEntity.name = 'Test Tenant';
      typeormEntity.slug = 'test-tenant';
      typeormEntity.description = null;
      typeormEntity.websiteUrl = null;
      typeormEntity.logoUrl = null;
      typeormEntity.faviconUrl = null;
      typeormEntity.primaryColor = null;
      typeormEntity.secondaryColor = null;
      typeormEntity.status = TenantStatusEnum.INACTIVE;
      typeormEntity.email = null;
      typeormEntity.phoneNumber = null;
      typeormEntity.phoneCode = null;
      typeormEntity.address = null;
      typeormEntity.city = null;
      typeormEntity.state = null;
      typeormEntity.country = null;
      typeormEntity.postalCode = null;
      typeormEntity.timezone = null;
      typeormEntity.locale = null;
      typeormEntity.maxUsers = null;
      typeormEntity.maxStorage = null;
      typeormEntity.maxApiCalls = null;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockTenantAggregate = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
          name: new TenantNameValueObject('Test Tenant'),
          slug: new TenantSlugValueObject('test-tenant'),
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: new TenantStatusValueObject(TenantStatusEnum.INACTIVE),
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockTenantAggregate);
      expect(mockTenantAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.INACTIVE,
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
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockTenantAggregate = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockTenantAggregate, 'toPrimitives')
        .mockReturnValue({
          id: tenantId,
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
          phoneNumber: '123456789',
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
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockTenantAggregate);

      expect(result).toBeInstanceOf(TenantTypeormEntity);
      expect(result.id).toBe(tenantId);
      expect(result.name).toBe('Test Tenant');
      expect(result.slug).toBe('test-tenant');
      expect(result.description).toBe('Test description');
      expect(result.websiteUrl).toBe('https://example.com');
      expect(result.logoUrl).toBe('https://example.com/logo.png');
      expect(result.faviconUrl).toBe('https://example.com/favicon.ico');
      expect(result.primaryColor).toBe('#FF0000');
      expect(result.secondaryColor).toBe('#00FF00');
      expect(result.status).toBe(TenantStatusEnum.ACTIVE);
      expect(result.email).toBe('test@example.com');
      expect(result.phoneNumber).toBe('123456789');
      expect(result.phoneCode).toBe('+1');
      expect(result.address).toBe('123 Main St');
      expect(result.city).toBe('New York');
      expect(result.state).toBe('NY');
      expect(result.country).toBe('USA');
      expect(result.postalCode).toBe('10001');
      expect(result.timezone).toBe('America/New_York');
      expect(result.locale).toBe('en-US');
      expect(result.maxUsers).toBe(100);
      expect(result.maxStorage).toBe(1000);
      expect(result.maxApiCalls).toBe(10000);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockTenantAggregate = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
          name: new TenantNameValueObject('Test Tenant'),
          slug: new TenantSlugValueObject('test-tenant'),
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: new TenantStatusValueObject(TenantStatusEnum.INACTIVE),
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockTenantAggregate, 'toPrimitives')
        .mockReturnValue({
          id: tenantId,
          name: 'Test Tenant',
          slug: 'test-tenant',
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: TenantStatusEnum.INACTIVE,
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

      const result = mapper.toTypeormEntity(mockTenantAggregate);

      expect(result).toBeInstanceOf(TenantTypeormEntity);
      expect(result.id).toBe(tenantId);
      expect(result.name).toBe('Test Tenant');
      expect(result.slug).toBe('test-tenant');
      expect(result.description).toBeNull();
      expect(result.websiteUrl).toBeNull();
      expect(result.logoUrl).toBeNull();
      expect(result.faviconUrl).toBeNull();
      expect(result.primaryColor).toBeNull();
      expect(result.secondaryColor).toBeNull();
      expect(result.status).toBe(TenantStatusEnum.INACTIVE);
      expect(result.email).toBeNull();
      expect(result.phoneNumber).toBeNull();
      expect(result.phoneCode).toBeNull();
      expect(result.address).toBeNull();
      expect(result.city).toBeNull();
      expect(result.state).toBeNull();
      expect(result.country).toBeNull();
      expect(result.postalCode).toBeNull();
      expect(result.timezone).toBeNull();
      expect(result.locale).toBeNull();
      expect(result.maxUsers).toBeNull();
      expect(result.maxStorage).toBeNull();
      expect(result.maxApiCalls).toBeNull();
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
