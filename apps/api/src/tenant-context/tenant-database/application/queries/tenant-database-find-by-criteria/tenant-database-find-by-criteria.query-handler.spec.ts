import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { ITenantDatabaseFindByCriteriaQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.dto';
import { FindTenantDatabasesByCriteriaQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.query';
import { FindTenantDatabasesByCriteriaQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.query-handler';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseReadRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';

describe('FindTenantDatabasesByCriteriaQueryHandler', () => {
  let handler: FindTenantDatabasesByCriteriaQueryHandler;
  let mockTenantDatabaseReadRepository: jest.Mocked<TenantDatabaseReadRepository>;

  beforeEach(() => {
    mockTenantDatabaseReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseReadRepository>;

    handler = new FindTenantDatabasesByCriteriaQueryHandler(
      mockTenantDatabaseReadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result with tenant databases when criteria matches', async () => {
      const criteria = new Criteria();
      const queryDto: ITenantDatabaseFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindTenantDatabasesByCriteriaQuery(queryDto);

      const mockTenantDatabases: TenantDatabaseViewModel[] = [
        new TenantDatabaseViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        }),
        new TenantDatabaseViewModel({
          id: '323e4567-e89b-12d3-a456-426614174002',
          tenantId: '423e4567-e89b-12d3-a456-426614174003',
          databaseName: 'tenant_db_002',
          readDatabaseName: 'tenant_db_read_002',
          status: TenantDatabaseStatusEnum.PROVISIONING,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new Date('2024-01-02T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(
        mockTenantDatabases,
        2,
        1,
        10,
      );

      mockTenantDatabaseReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(
        mockTenantDatabaseReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
      expect(
        mockTenantDatabaseReadRepository.findByCriteria,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no tenant databases match criteria', async () => {
      const criteria = new Criteria();
      const queryDto: ITenantDatabaseFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindTenantDatabasesByCriteriaQuery(queryDto);

      const mockPaginatedResult = new PaginatedResult([], 0, 1, 10);

      mockTenantDatabaseReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(
        mockTenantDatabaseReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
    });
  });
});
