import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseMongoDbDto } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/dtos/tenant-database-mongodb.dto';
import { TenantDatabaseMongoDBMapper } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/mappers/tenant-database-mongodb.mapper';
import { TenantDatabaseMongoRepository } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/repositories/tenant-database-mongodb.repository';
import { Collection } from 'mongodb';

describe('TenantDatabaseMongoRepository', () => {
  let repository: TenantDatabaseMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockTenantDatabaseMongoDBMapper: jest.Mocked<TenantDatabaseMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      toArray: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockTenantDatabaseMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseMongoDBMapper>;

    repository = new TenantDatabaseMongoRepository(
      mockMongoMasterService,
      mockTenantDatabaseMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant database view model when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const lastMigrationAt = new Date('2024-01-01T10:00:00Z');

      const mongoDoc: TenantDatabaseMongoDbDto = {
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockTenantDatabaseMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(tenantDatabaseId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'tenant-databases',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: tenantDatabaseId,
      });
      expect(mockTenantDatabaseMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should return null when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(tenantDatabaseId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: tenantDatabaseId,
      });
      expect(
        mockTenantDatabaseMongoDBMapper.toViewModel,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return tenant databases when databases exist for tenant', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const mongoDocs: TenantDatabaseMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: tenantId,
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174002',
          tenantId: tenantId,
          databaseName: 'tenant_db_002',
          readDatabaseName: 'tenant_db_read_002',
          status: TenantDatabaseStatusEnum.PROVISIONING,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new TenantDatabaseViewModel({
            id: doc.id,
            tenantId: doc.tenantId,
            databaseName: doc.databaseName,
            readDatabaseName: doc.readDatabaseName,
            status: doc.status as TenantDatabaseStatusEnum,
            schemaVersion: doc.schemaVersion,
            lastMigrationAt: doc.lastMigrationAt,
            errorMessage: doc.errorMessage,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      mongoDocs.forEach((doc, index) => {
        mockTenantDatabaseMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByTenantId(tenantId);

      expect(result).toHaveLength(2);
      expect(mockCollection.find).toHaveBeenCalledWith({ tenantId });
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(mockTenantDatabaseMongoDBMapper.toViewModel).toHaveBeenCalledTimes(
        2,
      );
    });

    it('should return empty array when no databases exist for tenant', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({ tenantId });
      expect(
        mockTenantDatabaseMongoDBMapper.toViewModel,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return tenant databases when databases exist for user', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174003';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const mongoDocs: TenantDatabaseMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModel = new TenantDatabaseViewModel({
        id: mongoDocs[0].id,
        tenantId: mongoDocs[0].tenantId,
        databaseName: mongoDocs[0].databaseName,
        readDatabaseName: mongoDocs[0].readDatabaseName,
        status: mongoDocs[0].status as TenantDatabaseStatusEnum,
        schemaVersion: mongoDocs[0].schemaVersion,
        lastMigrationAt: mongoDocs[0].lastMigrationAt,
        errorMessage: mongoDocs[0].errorMessage,
        createdAt: mongoDocs[0].createdAt,
        updatedAt: mongoDocs[0].updatedAt,
      });

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockTenantDatabaseMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByUserId(userId);

      expect(result).toHaveLength(1);
      expect(mockCollection.find).toHaveBeenCalledWith({ userId });
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(mockTenantDatabaseMongoDBMapper.toViewModel).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty array when no databases exist for user', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174003';

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({ userId });
      expect(
        mockTenantDatabaseMongoDBMapper.toViewModel,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with tenant databases when criteria matches', async () => {
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: TenantDatabaseMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174002',
          tenantId: '423e4567-e89b-12d3-a456-426614174003',
          databaseName: 'tenant_db_002',
          readDatabaseName: 'tenant_db_read_002',
          status: TenantDatabaseStatusEnum.PROVISIONING,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new TenantDatabaseViewModel({
            id: doc.id,
            tenantId: doc.tenantId,
            databaseName: doc.databaseName,
            readDatabaseName: doc.readDatabaseName,
            status: doc.status as TenantDatabaseStatusEnum,
            schemaVersion: doc.schemaVersion,
            lastMigrationAt: doc.lastMigrationAt,
            errorMessage: doc.errorMessage,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(2);

      mongoDocs.forEach((doc, index) => {
        mockTenantDatabaseMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCursor.sort).toHaveBeenCalled();
      expect(mockCursor.skip).toHaveBeenCalledWith(0);
      expect(mockCursor.limit).toHaveBeenCalledWith(10);
      expect(mockCollection.countDocuments).toHaveBeenCalled();
    });

    it('should return empty paginated result when no tenant databases match criteria', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });

    it('should handle criteria with filters', async () => {
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const criteria = new Criteria(
        [
          {
            field: 'status',
            operator: FilterOperator.EQUALS,
            value: TenantDatabaseStatusEnum.ACTIVE,
          },
        ],
        [],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: TenantDatabaseMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status: TenantDatabaseStatusEnum.ACTIVE,
          schemaVersion: '1.0.0',
          lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
          errorMessage: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModel = new TenantDatabaseViewModel({
        id: mongoDocs[0].id,
        tenantId: mongoDocs[0].tenantId,
        databaseName: mongoDocs[0].databaseName,
        readDatabaseName: mongoDocs[0].readDatabaseName,
        status: mongoDocs[0].status as TenantDatabaseStatusEnum,
        schemaVersion: mongoDocs[0].schemaVersion,
        lastMigrationAt: mongoDocs[0].lastMigrationAt,
        errorMessage: mongoDocs[0].errorMessage,
        createdAt: mongoDocs[0].createdAt,
        updatedAt: mongoDocs[0].updatedAt,
      });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(1);
      mockTenantDatabaseMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 5 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(mockCursor.skip).toHaveBeenCalledWith(5);
      expect(mockCursor.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('save', () => {
    it('should save tenant database view model using upsert', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const mongoData: TenantDatabaseMongoDbDto = {
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      mockTenantDatabaseMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });

      await repository.save(viewModel);

      expect(mockTenantDatabaseMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: tenantDatabaseId },
        mongoData,
        { upsert: true },
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledTimes(1);
    });

    it('should handle upsert when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const mongoData: TenantDatabaseMongoDbDto = {
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      mockTenantDatabaseMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: tenantDatabaseId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete tenant database view model and return true', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await repository.delete(tenantDatabaseId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: tenantDatabaseId,
      });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should return true even when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 0,
      });

      const result = await repository.delete(tenantDatabaseId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: tenantDatabaseId,
      });
    });
  });
});
