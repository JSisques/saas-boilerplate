import { FindTenantDatabaseByIdQuery } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-id/tenant-database-find-by-id.query';
import { FindTenantDatabaseByIdQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-id/tenant-database-find-by-id.query-handler';
import { ITenantDatabaseFindByIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-by-id/tenant-database-find-by-id.dto';
import { TenantDatabaseNotFoundException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-not-found/tenant-database-not-found.exception';
import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

describe('FindTenantDatabaseByIdQueryHandler', () => {
  let handler: FindTenantDatabaseByIdQueryHandler;
  let mockAssertTenantDatabaseExsistsService: Partial<
    jest.Mocked<AssertTenantDatabaseExsistsService>
  >;

  beforeEach(() => {
    mockAssertTenantDatabaseExsistsService = {
      execute: jest.fn(),
    } as Partial<jest.Mocked<AssertTenantDatabaseExsistsService>>;

    handler = new FindTenantDatabaseByIdQueryHandler(
      mockAssertTenantDatabaseExsistsService as unknown as AssertTenantDatabaseExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant database aggregate when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantDatabaseFindByIdQueryDto = {
        id: tenantDatabaseId,
      };
      const query = new FindTenantDatabaseByIdQuery(queryDto);

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

      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        mockTenantDatabase,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockTenantDatabase);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantDatabaseFindByIdQueryDto = {
        id: tenantDatabaseId,
      };
      const query = new FindTenantDatabaseByIdQuery(queryDto);

      const error = new TenantDatabaseNotFoundException(tenantDatabaseId);
      mockAssertTenantDatabaseExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `Tenant database with id ${tenantDatabaseId} not found`,
      );

      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledTimes(2);
    });

    it('should call service with correct id from query', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantDatabaseFindByIdQueryDto = {
        id: tenantDatabaseId,
      };
      const query = new FindTenantDatabaseByIdQuery(queryDto);

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

      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        mockTenantDatabase,
      );

      await handler.execute(query);

      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(query.id.value);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
