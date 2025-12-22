import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantDatabaseAlreadyExistsException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-already-exists/tenant-database-already-exists.exception';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';

describe('AssertTenantDatabaseViewModelExsistsService', () => {
  let service: AssertTenantDatabaseViewModelExsistsService;
  let mockTenantDatabaseReadRepository: jest.Mocked<TenantDatabaseReadRepository>;

  beforeEach(() => {
    mockTenantDatabaseReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseReadRepository>;

    service = new AssertTenantDatabaseViewModelExsistsService(
      mockTenantDatabaseReadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant database view model when view model exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const mockViewModel = new TenantDatabaseViewModel({
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

      mockTenantDatabaseReadRepository.findById.mockResolvedValue(
        mockViewModel,
      );

      const result = await service.execute(tenantDatabaseId);

      expect(result).toBe(mockViewModel);
      expect(mockTenantDatabaseReadRepository.findById).toHaveBeenCalledWith(
        tenantDatabaseId,
      );
      expect(mockTenantDatabaseReadRepository.findById).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw exception when tenant database view model does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockTenantDatabaseReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(tenantDatabaseId)).rejects.toThrow(
        TenantDatabaseAlreadyExistsException,
      );
      expect(mockTenantDatabaseReadRepository.findById).toHaveBeenCalledWith(
        tenantDatabaseId,
      );
    });
  });
});
