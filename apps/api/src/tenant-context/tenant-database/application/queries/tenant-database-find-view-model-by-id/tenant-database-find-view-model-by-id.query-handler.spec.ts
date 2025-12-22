import { FindTenantDatabaseViewModelByIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-view-model-by-id/tenant-database-find-view-model-by-id.query';
import { FindTenantDatabaseViewModelByIdQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-view-model-by-id/tenant-database-find-view-model-by-id.query-handler';
import { ITenantDatabaseFindViewModelByIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-view-model-by-id/tenant-database-find-view-model-by-id.dto';
import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';

describe('FindTenantDatabaseViewModelByIdQueryHandler', () => {
  let handler: FindTenantDatabaseViewModelByIdQueryHandler;
  let mockAssertTenantDatabaseViewModelExsistsService: Partial<
    jest.Mocked<AssertTenantDatabaseViewModelExsistsService>
  >;

  beforeEach(() => {
    mockAssertTenantDatabaseViewModelExsistsService = {
      execute: jest.fn(),
    } as Partial<jest.Mocked<AssertTenantDatabaseViewModelExsistsService>>;

    handler = new FindTenantDatabaseViewModelByIdQueryHandler(
      mockAssertTenantDatabaseViewModelExsistsService as unknown as AssertTenantDatabaseViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant database view model when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantDatabaseFindViewModelByIdQueryDto = {
        id: tenantDatabaseId,
      };
      const query = new FindTenantDatabaseViewModelByIdQuery(queryDto);

      const mockTenantDatabaseViewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });

      mockAssertTenantDatabaseViewModelExsistsService.execute.mockResolvedValue(
        mockTenantDatabaseViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockTenantDatabaseViewModel);
      expect(
        mockAssertTenantDatabaseViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(
        mockAssertTenantDatabaseViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when tenant database view model does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantDatabaseFindViewModelByIdQueryDto = {
        id: tenantDatabaseId,
      };
      const query = new FindTenantDatabaseViewModelByIdQuery(queryDto);

      const error = new Error('Tenant database view model not found');
      mockAssertTenantDatabaseViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(
        mockAssertTenantDatabaseViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
    });
  });
});
