import { TenantDatabaseDeletedEventHandler } from '@/tenant-context/tenant-database/application/event-handlers/tenant-database-deleted/tenant-database-deleted.event-handler';
import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseDeletedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-deleted/tenant-database-deleted.event';

describe('TenantDatabaseDeletedEventHandler', () => {
  let handler: TenantDatabaseDeletedEventHandler;
  let mockTenantDatabaseReadRepository: jest.Mocked<TenantDatabaseReadRepository>;
  let mockAssertTenantDatabaseViewModelExsistsService: jest.Mocked<AssertTenantDatabaseViewModelExsistsService>;

  beforeEach(() => {
    mockTenantDatabaseReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseReadRepository>;

    mockAssertTenantDatabaseViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantDatabaseViewModelExsistsService>;

    handler = new TenantDatabaseDeletedEventHandler(
      mockTenantDatabaseReadRepository,
      mockAssertTenantDatabaseViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete tenant database view model when event is handled', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      const event = new TenantDatabaseDeletedEvent(
        {
          aggregateId: tenantDatabaseId,
          aggregateType: 'TenantDatabaseAggregate',
          eventType: 'TenantDatabaseDeletedEvent',
        },
        {
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
        },
      );

      const existingViewModel = new TenantDatabaseViewModel({
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
        existingViewModel,
      );
      mockTenantDatabaseReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertTenantDatabaseViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(mockTenantDatabaseReadRepository.delete).toHaveBeenCalledWith(
        tenantDatabaseId,
      );
      expect(mockTenantDatabaseReadRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
