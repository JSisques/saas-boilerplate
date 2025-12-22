import { FindTenantDatabasesByCriteriaQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.query';
import { FindTenantDatabaseViewModelByIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-view-model-by-id/tenant-database-find-view-model-by-id.query';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseFindByCriteriaRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-find-by-criteria.request.dto';
import { TenantDatabaseFindByIdRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-find-by-id.request.dto';
import {
  PaginatedTenantDatabaseResultDto,
  TenantDatabaseResponseDto,
} from '@/tenant-context/tenant-database/transport/graphql/dtos/responses/tenant-database.response.dto';
import { TenantDatabaseGraphQLMapper } from '@/tenant-context/tenant-database/transport/graphql/mappers/tenant-database.mapper';
import { TenantDatabaseQueryResolver } from '@/tenant-context/tenant-database/transport/graphql/resolvers/tenant-database-queries.resolver';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';

describe('TenantDatabaseQueryResolver', () => {
  let resolver: TenantDatabaseQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockTenantDatabaseGraphQLMapper: jest.Mocked<TenantDatabaseGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockTenantDatabaseGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseGraphQLMapper>;

    resolver = new TenantDatabaseQueryResolver(
      mockQueryBus,
      mockTenantDatabaseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('tenantDatabaseFindByCriteria', () => {
    it('should return paginated tenant databases when criteria matches', async () => {
      const input: TenantDatabaseFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const viewModels: TenantDatabaseViewModel[] = [
        new TenantDatabaseViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedTenantDatabaseResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174001',
            databaseName: 'tenant_db_001',
            readDatabaseName: 'tenant_db_read_001',
            status: TenantDatabaseStatusEnum.ACTIVE,
            schemaVersion: '1.0.0',
            lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
            errorMessage: null,
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
      mockTenantDatabaseGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantDatabaseFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantDatabasesByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindTenantDatabasesByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockTenantDatabaseGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return paginated tenant databases with null input', async () => {
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const viewModels: TenantDatabaseViewModel[] = [
        new TenantDatabaseViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedTenantDatabaseResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174001',
            databaseName: 'tenant_db_001',
            readDatabaseName: 'tenant_db_read_001',
            status: TenantDatabaseStatusEnum.ACTIVE,
            schemaVersion: '1.0.0',
            lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
            errorMessage: null,
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
      mockTenantDatabaseGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantDatabaseFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantDatabasesByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria).toBeInstanceOf(Criteria);
    });

    it('should handle errors when finding tenant databases by criteria', async () => {
      const input: TenantDatabaseFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Query execution failed');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(
        resolver.tenantDatabaseFindByCriteria(input),
      ).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantDatabasesByCriteriaQuery),
      );
      expect(
        mockTenantDatabaseGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('tenantDatabaseFindById', () => {
    it('should return tenant database when found by id', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseFindByIdRequestDto = {
        id: tenantDatabaseId,
      };

      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const responseDto: TenantDatabaseResponseDto = {
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockTenantDatabaseGraphQLMapper.toResponseDto.mockReturnValue(
        responseDto,
      );

      const result = await resolver.tenantDatabaseFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantDatabaseViewModelByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindTenantDatabaseViewModelByIdQuery);
      expect(query.id.value).toBe(tenantDatabaseId);
      expect(
        mockTenantDatabaseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith(viewModel);
    });

    it('should handle errors when finding tenant database by id', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseFindByIdRequestDto = {
        id: tenantDatabaseId,
      };

      const error = new Error('Tenant database not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantDatabaseFindById(input)).rejects.toThrow(
        error,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantDatabaseViewModelByIdQuery),
      );
      expect(
        mockTenantDatabaseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
