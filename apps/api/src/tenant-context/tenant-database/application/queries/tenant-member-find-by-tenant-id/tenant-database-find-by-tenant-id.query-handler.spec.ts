import { FindTenantDatabaseByTenantIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-member-find-by-tenant-id/tenant-database-find-by-tenant-id.query';
import { FindTenantDatabaseByTenantIdQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-member-find-by-tenant-id/tenant-database-find-by-tenant-id.query-handler';
import { ITenantDatabaseFindByTenantIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-by-tenant-id/tenant-database-find-by-tenant-id.dto';
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

describe('FindTenantDatabaseByTenantIdQueryHandler', () => {
  let handler: FindTenantDatabaseByTenantIdQueryHandler;
  let mockTenantDatabaseWriteRepository: jest.Mocked<TenantDatabaseWriteRepository>;

  beforeEach(() => {
    mockTenantDatabaseWriteRepository = {
      findById: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseWriteRepository>;

    handler = new FindTenantDatabaseByTenantIdQueryHandler(
      mockTenantDatabaseWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant database aggregate when tenant database exists for tenant id', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const queryDto: ITenantDatabaseFindByTenantIdQueryDto = {
        tenantId,
      };
      const query = new FindTenantDatabaseByTenantIdQuery(queryDto);

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

      const result = await handler.execute(query);

      expect(result).toBe(mockTenantDatabase);
      expect(
        mockTenantDatabaseWriteRepository.findByTenantId,
      ).toHaveBeenCalledWith(tenantId);
      expect(
        mockTenantDatabaseWriteRepository.findByTenantId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant database does not exist for tenant id', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const queryDto: ITenantDatabaseFindByTenantIdQueryDto = {
        tenantId,
      };
      const query = new FindTenantDatabaseByTenantIdQuery(queryDto);

      mockTenantDatabaseWriteRepository.findByTenantId.mockResolvedValue(null);

      const result = await handler.execute(query);

      expect(result).toBeNull();
      expect(
        mockTenantDatabaseWriteRepository.findByTenantId,
      ).toHaveBeenCalledWith(tenantId);
    });
  });
});
