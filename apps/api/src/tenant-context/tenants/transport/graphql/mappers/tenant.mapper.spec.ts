import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantGraphQLMapper } from '@/tenant-context/tenants/transport/graphql/mappers/tenant.mapper';
import { TenantMemberViewModel } from '@/tenant-context/tenants/domain/view-models/tenant-member/tenant-member.view-model';

describe('TenantGraphQLMapper', () => {
  let mapper: TenantGraphQLMapper;

  beforeEach(() => {
    mapper = new TenantGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert tenant view model to response DTO with all properties', () => {
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

      const result = mapper.toResponseDto(viewModel);

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

    it('should convert tenant view model to response DTO with null optional properties', () => {
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

      const result = mapper.toResponseDto(viewModel);

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

    it('should convert tenant view model with tenant members', () => {
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

      const result = mapper.toResponseDto(viewModel);

      expect(result.tenantMembers).toHaveLength(1);
      expect(result.tenantMembers[0]).toBeInstanceOf(TenantMemberViewModel);
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModels: TenantViewModel[] = [
        new TenantViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Tenant 1',
          slug: 'test-tenant-1',
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
        }),
        new TenantViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Test Tenant 2',
          slug: 'test-tenant-2',
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
          tenantMembers: [],
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.items[1].id).toBe('223e4567-e89b-12d3-a456-426614174001');
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });
  });
});
