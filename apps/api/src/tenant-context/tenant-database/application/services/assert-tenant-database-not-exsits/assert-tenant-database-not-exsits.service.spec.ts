import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseAlreadyExistsException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-already-exists/tenant-database-already-exists.exception';
import { AssertTenantDatabaseNotExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-not-exsits/assert-tenant-database-not-exsits.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseWriteRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

describe('AssertTenantDatabaseNotExsistsService', () => {
  let service: AssertTenantDatabaseNotExsistsService;
  let mockTenantDatabaseWriteRepository: jest.Mocked<TenantDatabaseWriteRepository>;

  beforeEach(() => {
    mockTenantDatabaseWriteRepository = {
      findById: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseWriteRepository>;

    service = new AssertTenantDatabaseNotExsistsService(
      mockTenantDatabaseWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return void when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockTenantDatabaseWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(tenantDatabaseId)).resolves.toBeUndefined();
      expect(mockTenantDatabaseWriteRepository.findById).toHaveBeenCalledWith(
        tenantDatabaseId,
      );
      expect(mockTenantDatabaseWriteRepository.findById).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw TenantDatabaseAlreadyExistsException when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const mockTenantDatabase = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174001',
          ),
          databaseName: new TenantDatabaseNameValueObject('tenant_db_001'),
          readDatabaseName: new TenantDatabaseNameValueObject(
            'tenant_db_read_001',
          ),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.ACTIVE,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockTenantDatabaseWriteRepository.findById.mockResolvedValue(
        mockTenantDatabase,
      );

      await expect(service.execute(tenantDatabaseId)).rejects.toThrow(
        TenantDatabaseAlreadyExistsException,
      );
      await expect(service.execute(tenantDatabaseId)).rejects.toThrow(
        `Tenant database with id ${tenantDatabaseId} already exists`,
      );
      expect(mockTenantDatabaseWriteRepository.findById).toHaveBeenCalledWith(
        tenantDatabaseId,
      );
    });
  });
});
