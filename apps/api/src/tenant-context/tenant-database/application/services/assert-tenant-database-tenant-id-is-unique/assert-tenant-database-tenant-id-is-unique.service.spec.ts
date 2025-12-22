import { AssertTenantDatabaseTenantIdIsUniqueService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-tenant-id-is-unique/assert-tenant-database-tenant-id-is-unique.service';
import { TenantDatabaseTenantIdIsNotUniqueException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-tenant-id-exists/tenant-database-tenant-id-exists.exception';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

describe('AssertTenantDatabaseTenantIdIsUniqueService', () => {
  let service: AssertTenantDatabaseTenantIdIsUniqueService;
  let mockTenantDatabaseWriteRepository: jest.Mocked<TenantDatabaseWriteRepository>;

  beforeEach(() => {
    mockTenantDatabaseWriteRepository = {
      findById: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseWriteRepository>;

    service = new AssertTenantDatabaseTenantIdIsUniqueService(
      mockTenantDatabaseWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return void when tenant id is unique', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';

      mockTenantDatabaseWriteRepository.findByTenantId.mockResolvedValue(null);

      await expect(service.execute(tenantId)).resolves.toBeUndefined();
      expect(
        mockTenantDatabaseWriteRepository.findByTenantId,
      ).toHaveBeenCalledWith(tenantId);
      expect(
        mockTenantDatabaseWriteRepository.findByTenantId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantDatabaseTenantIdIsNotUniqueException when tenant id is not unique', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const mockTenantDatabase = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          tenantId: new TenantUuidValueObject(tenantId),
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

      mockTenantDatabaseWriteRepository.findByTenantId.mockResolvedValue(
        mockTenantDatabase,
      );

      await expect(service.execute(tenantId)).rejects.toThrow(
        TenantDatabaseTenantIdIsNotUniqueException,
      );
      await expect(service.execute(tenantId)).rejects.toThrow(
        `Tenant database tenant id ${tenantId} is not unique`,
      );
      expect(
        mockTenantDatabaseWriteRepository.findByTenantId,
      ).toHaveBeenCalledWith(tenantId);
    });
  });
});
