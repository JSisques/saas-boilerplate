import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model/tenant-view-model.factory';
import { TenantMemberViewModel } from '@/tenant-context/tenants/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantMongoDBMapper } from '@/tenant-context/tenants/infrastructure/database/mongodb/mappers/tenant-mongodb.mapper';
import { TenantMongoDbDto } from '@/tenant-context/tenants/infrastructure/database/mongodb/dtos/tenant/tenant-mongodb.dto';

describe('TenantMongoDBMapper', () => {
  let mapper: TenantMongoDBMapper;
  let mockTenantViewModelFactory: jest.Mocked<TenantViewModelFactory>;

  beforeEach(() => {
    mockTenantViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<TenantViewModelFactory>;

    mapper = new TenantMongoDBMapper(mockTenantViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all fields', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const mongoDoc: TenantMongoDbDto = {
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new TenantViewModel({
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockTenantViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockTenantViewModelFactory.create).toHaveBeenCalledWith({
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert MongoDB document with null optional fields', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const mongoDoc: TenantMongoDbDto = {
        id: tenantId,
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
        tenantMembers: undefined,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new TenantViewModel({
        id: tenantId,
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockTenantViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockTenantViewModelFactory.create).toHaveBeenCalledWith({
        id: tenantId,
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert MongoDB document with tenant members', () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const mongoDoc: TenantMongoDbDto = {
        id: tenantId,
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
        tenantMembers: [
          {
            id: 'member-1',
            userId: 'user-1',
            role: 'admin',
            createdAt: createdAt,
            updatedAt: updatedAt,
          },
        ],
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new TenantViewModel({
        id: tenantId,
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
        tenantMembers: [
          new TenantMemberViewModel({
            id: 'member-1',
            userId: 'user-1',
            role: 'admin',
            createdAt: createdAt,
            updatedAt: updatedAt,
          }),
        ],
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockTenantViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockTenantViewModelFactory.create).toHaveBeenCalled();
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all fields', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantViewModel({
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = await mapper.toMongoData(viewModel);

      expect(result).toEqual({
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert view model with null optional fields', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantViewModel({
        id: tenantId,
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = await mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: tenantId,
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert view model with tenant members', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantViewModel({
        id: tenantId,
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
        tenantMembers: [
          new TenantMemberViewModel({
            id: 'member-1',
            userId: 'user-1',
            role: 'admin',
            createdAt: createdAt,
            updatedAt: updatedAt,
          }),
        ],
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = await mapper.toMongoData(viewModel);

      expect(result.tenantMembers).toEqual([
        {
          id: 'member-1',
          userId: 'user-1',
          role: 'admin',
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ]);
    });
  });
});
