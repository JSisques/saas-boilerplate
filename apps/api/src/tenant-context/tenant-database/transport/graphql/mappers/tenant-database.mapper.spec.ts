import { TenantDatabaseGraphQLMapper } from '@/tenant-context/tenant-database/transport/graphql/mappers/tenant-database.mapper';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import {
  PaginatedTenantDatabaseResultDto,
  TenantDatabaseResponseDto,
} from '@/tenant-context/tenant-database/transport/graphql/dtos/responses/tenant-database.response.dto';

describe('TenantDatabaseGraphQLMapper', () => {
  let mapper: TenantDatabaseGraphQLMapper;

  beforeEach(() => {
    mapper = new TenantDatabaseGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert tenant database view model to response DTO with all properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const lastMigrationAt = new Date('2024-01-01T10:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert tenant database view model to response DTO with null optional properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert tenant database view model with error message', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Connection timeout',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Connection timeout',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert tenant database view model with all status values', () => {
      const statuses = [
        TenantDatabaseStatusEnum.PROVISIONING,
        TenantDatabaseStatusEnum.ACTIVE,
        TenantDatabaseStatusEnum.MIGRATING,
        TenantDatabaseStatusEnum.FAILED,
        TenantDatabaseStatusEnum.SUSPENDED,
      ];

      statuses.forEach((status) => {
        const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
        const tenantId = '223e4567-e89b-12d3-a456-426614174001';
        const createdAt = new Date('2024-01-01T00:00:00Z');
        const updatedAt = new Date('2024-01-01T00:00:00Z');

        const viewModel = new TenantDatabaseViewModel({
          id: tenantDatabaseId,
          tenantId: tenantId,
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: status,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        });

        const result = mapper.toResponseDto(viewModel);

        expect(result.status).toBe(status);
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
      const tenantDatabaseId1 = '123e4567-e89b-12d3-a456-426614174000';
      const tenantDatabaseId2 = '323e4567-e89b-12d3-a456-426614174002';
      const tenantId1 = '223e4567-e89b-12d3-a456-426614174001';
      const tenantId2 = '423e4567-e89b-12d3-a456-426614174003';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModels: TenantDatabaseViewModel[] = [
        new TenantDatabaseViewModel({
          id: tenantDatabaseId1,
          tenantId: tenantId1,
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
        new TenantDatabaseViewModel({
          id: tenantDatabaseId2,
          tenantId: tenantId2,
          databaseName: 'tenant_db_002',
          readDatabaseName: 'tenant_db_read_002',
          status: TenantDatabaseStatusEnum.PROVISIONING,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
        items: [
          {
            id: tenantDatabaseId1,
            tenantId: tenantId1,
            databaseName: 'tenant_db_001',
            readDatabaseName: 'tenant_db_read_001',
            status: TenantDatabaseStatusEnum.ACTIVE,
            schemaVersion: '1.0.0',
            lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
            errorMessage: null,
            createdAt: createdAt,
            updatedAt: updatedAt,
          },
          {
            id: tenantDatabaseId2,
            tenantId: tenantId2,
            databaseName: 'tenant_db_002',
            readDatabaseName: 'tenant_db_read_002',
            status: TenantDatabaseStatusEnum.PROVISIONING,
            schemaVersion: null,
            lastMigrationAt: null,
            errorMessage: null,
            createdAt: createdAt,
            updatedAt: updatedAt,
          },
        ],
        total: 2,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
      expect(result.items).toHaveLength(2);
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      });
      expect(result.items).toHaveLength(0);
    });

    it('should handle pagination with multiple pages', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModels: TenantDatabaseViewModel[] = [
        new TenantDatabaseViewModel({
          id: tenantDatabaseId,
          tenantId: tenantId,
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

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(3);
    });
  });
});
