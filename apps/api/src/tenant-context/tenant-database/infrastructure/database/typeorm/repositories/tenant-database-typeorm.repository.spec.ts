import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseTypeormEntity } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/entities/tenant-database-typeorm.entity';
import { TenantDatabaseTypeormMapper } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/mappers/tenant-database-typeorm.mapper';
import { TenantDatabaseTypeormRepository } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/repositories/tenant-database-typeorm.repository';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

describe('TenantDatabaseTypeormRepository', () => {
  let repository: TenantDatabaseTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockTenantDatabaseTypeormMapper: jest.Mocked<TenantDatabaseTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<
    Repository<TenantDatabaseTypeormEntity>
  >;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<TenantDatabaseTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockTenantDatabaseTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseTypeormMapper>;

    repository = new TenantDatabaseTypeormRepository(
      mockTypeormMasterService,
      mockTenantDatabaseTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant database aggregate when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantDatabaseTypeormEntity();
      typeormEntity.id = tenantDatabaseId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.databaseName = 'test_db';
      typeormEntity.readDatabaseName = 'test_db_read';
      typeormEntity.status = TenantDatabaseStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const tenantDatabaseAggregate = new TenantDatabaseAggregate(
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockTenantDatabaseTypeormMapper.toDomainEntity.mockReturnValue(
        tenantDatabaseAggregate,
      );

      const result = await repository.findById(tenantDatabaseId);

      expect(result).toBe(tenantDatabaseAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: tenantDatabaseId },
      });
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledWith(typeormEntity);
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(tenantDatabaseId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: tenantDatabaseId },
      });
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return tenant database aggregate when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantDatabaseTypeormEntity();
      typeormEntity.id = tenantDatabaseId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.databaseName = 'test_db';
      typeormEntity.readDatabaseName = 'test_db_read';
      typeormEntity.status = TenantDatabaseStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const tenantDatabaseAggregate = new TenantDatabaseAggregate(
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockTenantDatabaseTypeormMapper.toDomainEntity.mockReturnValue(
        tenantDatabaseAggregate,
      );

      const result = await repository.findByTenantId(tenantId);

      expect(result).toBe(tenantDatabaseAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { tenantId },
      });
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledWith(typeormEntity);
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant database does not exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { tenantId },
      });
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save tenant database aggregate and return saved aggregate', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const tenantDatabaseAggregate = new TenantDatabaseAggregate(
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

      const typeormEntity = new TenantDatabaseTypeormEntity();
      typeormEntity.id = tenantDatabaseId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.databaseName = 'test_db';
      typeormEntity.readDatabaseName = 'test_db_read';
      typeormEntity.status = TenantDatabaseStatusEnum.ACTIVE;

      const savedTypeormEntity = new TenantDatabaseTypeormEntity();
      savedTypeormEntity.id = tenantDatabaseId;
      savedTypeormEntity.tenantId = tenantId;
      savedTypeormEntity.databaseName = 'test_db';
      savedTypeormEntity.readDatabaseName = 'test_db_read';
      savedTypeormEntity.status = TenantDatabaseStatusEnum.ACTIVE;

      const savedTenantDatabaseAggregate = new TenantDatabaseAggregate(
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

      mockTenantDatabaseTypeormMapper.toTypeormEntity.mockReturnValue(
        typeormEntity,
      );
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockTenantDatabaseTypeormMapper.toDomainEntity.mockReturnValue(
        savedTenantDatabaseAggregate,
      );

      const result = await repository.save(tenantDatabaseAggregate);

      expect(result).toBe(savedTenantDatabaseAggregate);
      expect(
        mockTenantDatabaseTypeormMapper.toTypeormEntity,
      ).toHaveBeenCalledWith(tenantDatabaseAggregate);
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(
        mockTenantDatabaseTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledWith(savedTypeormEntity);
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete tenant database and return true', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(tenantDatabaseId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantDatabaseId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(tenantDatabaseId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantDatabaseId);
    });

    it('should handle delete errors correctly', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Tenant database not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(tenantDatabaseId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantDatabaseId);
    });
  });
});
