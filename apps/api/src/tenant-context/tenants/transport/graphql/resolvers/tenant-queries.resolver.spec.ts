import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FindTenantsByCriteriaQuery } from '@/tenant-context/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantFindByCriteriaRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-find-by-criteria.request.dto';
import { PaginatedTenantResultDto } from '@/tenant-context/tenants/transport/graphql/dtos/responses/tenant/tenant.response.dto';
import { TenantGraphQLMapper } from '@/tenant-context/tenants/transport/graphql/mappers/tenant.mapper';
import { TenantQueryResolver } from '@/tenant-context/tenants/transport/graphql/resolvers/tenant-queries.resolver';
import { QueryBus } from '@nestjs/cqrs';

describe('TenantQueryResolver', () => {
  let resolver: TenantQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockTenantGraphQLMapper: jest.Mocked<TenantGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockTenantGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<TenantGraphQLMapper>;

    resolver = new TenantQueryResolver(mockQueryBus, mockTenantGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('tenantFindByCriteria', () => {
    it('should return paginated tenants when criteria matches', async () => {
      const input: TenantFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

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
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedTenantResultDto = {
        items: [
          {
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
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockTenantGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindTenantsByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockTenantGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return paginated tenants with null input', async () => {
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
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedTenantResultDto = {
        items: [
          {
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
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockTenantGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria).toBeInstanceOf(Criteria);
    });

    it('should handle errors when finding tenants by criteria', async () => {
      const input: TenantFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Query execution failed');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantFindByCriteria(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantsByCriteriaQuery),
      );
      expect(
        mockTenantGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
