import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { TenantDatabaseTypeormEntity } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/entities/tenant-database-typeorm.entity';
import { TenantDatabaseTypeormMapper } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/mappers/tenant-database-typeorm.mapper';

describe('TenantDatabaseTypeormMapper', () => {
  let mapper: TenantDatabaseTypeormMapper;
  let mockTenantDatabaseAggregateFactory: jest.Mocked<TenantDatabaseAggregateFactory>;

  beforeEach(() => {
    mockTenantDatabaseAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseAggregateFactory>;

    mapper = new TenantDatabaseTypeormMapper(
      mockTenantDatabaseAggregateFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const lastMigrationAt = new Date();

      const typeormEntity = new TenantDatabaseTypeormEntity();
      typeormEntity.id = tenantDatabaseId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.databaseName = 'test_db';
      typeormEntity.readDatabaseName = 'test_db_read';
      typeormEntity.status = TenantDatabaseStatusEnum.ACTIVE;
      typeormEntity.schemaVersion = '1.0.0';
      typeormEntity.lastMigrationAt = lastMigrationAt;
      typeormEntity.errorMessage = null;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockTenantDatabaseAggregate = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(tenantId),
          databaseName: new TenantDatabaseNameValueObject('test_db'),
          readDatabaseName: new TenantDatabaseNameValueObject('test_db_read'),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.ACTIVE,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantDatabaseAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantDatabaseAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockTenantDatabaseAggregate);
      expect(
        mockTenantDatabaseAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'test_db',
        readDatabaseName: 'test_db_read',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: now,
        updatedAt: now,
      });
      expect(
        mockTenantDatabaseAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantDatabaseTypeormEntity();
      typeormEntity.id = tenantDatabaseId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.databaseName = 'test_db';
      typeormEntity.readDatabaseName = 'test_db_read';
      typeormEntity.status = TenantDatabaseStatusEnum.PROVISIONING;
      typeormEntity.schemaVersion = null;
      typeormEntity.lastMigrationAt = null;
      typeormEntity.errorMessage = null;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockTenantDatabaseAggregate = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(tenantId),
          databaseName: new TenantDatabaseNameValueObject('test_db'),
          readDatabaseName: new TenantDatabaseNameValueObject('test_db_read'),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.PROVISIONING,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantDatabaseAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantDatabaseAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockTenantDatabaseAggregate);
      expect(
        mockTenantDatabaseAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'test_db',
        readDatabaseName: 'test_db_read',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const lastMigrationAt = new Date();

      const mockTenantDatabaseAggregate = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(tenantId),
          databaseName: new TenantDatabaseNameValueObject('test_db'),
          readDatabaseName: new TenantDatabaseNameValueObject('test_db_read'),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.ACTIVE,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockTenantDatabaseAggregate, 'toPrimitives')
        .mockReturnValue({
          id: tenantDatabaseId,
          tenantId: tenantId,
          databaseName: 'test_db',
          readDatabaseName: 'test_db_read',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: lastMigrationAt,
          errorMessage: null,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockTenantDatabaseAggregate);

      expect(result).toBeInstanceOf(TenantDatabaseTypeormEntity);
      expect(result.id).toBe(tenantDatabaseId);
      expect(result.tenantId).toBe(tenantId);
      expect(result.databaseName).toBe('test_db');
      expect(result.readDatabaseName).toBe('test_db_read');
      expect(result.status).toBe(TenantDatabaseStatusEnum.ACTIVE);
      expect(result.schemaVersion).toBe('1.0.0');
      expect(result.lastMigrationAt).toEqual(lastMigrationAt);
      expect(result.errorMessage).toBeNull();
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockTenantDatabaseAggregate = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(tenantId),
          databaseName: new TenantDatabaseNameValueObject('test_db'),
          readDatabaseName: new TenantDatabaseNameValueObject('test_db_read'),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.PROVISIONING,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockTenantDatabaseAggregate, 'toPrimitives')
        .mockReturnValue({
          id: tenantDatabaseId,
          tenantId: tenantId,
          databaseName: 'test_db',
          readDatabaseName: 'test_db_read',
          status: TenantDatabaseStatusEnum.PROVISIONING,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockTenantDatabaseAggregate);

      expect(result).toBeInstanceOf(TenantDatabaseTypeormEntity);
      expect(result.id).toBe(tenantDatabaseId);
      expect(result.tenantId).toBe(tenantId);
      expect(result.databaseName).toBe('test_db');
      expect(result.readDatabaseName).toBe('test_db_read');
      expect(result.status).toBe(TenantDatabaseStatusEnum.PROVISIONING);
      expect(result.schemaVersion).toBeNull();
      expect(result.lastMigrationAt).toBeNull();
      expect(result.errorMessage).toBeNull();
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
