import { StorageMongoRepository } from '@/storage-context/storage/infrastructure/database/mongodb/repositories/storage-mongodb.repository';
import { StorageMongoDBMapper } from '@/storage-context/storage/infrastructure/database/mongodb/mappers/storage-mongodb.mapper';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { StorageMongoDbDto } from '@/storage-context/storage/infrastructure/database/mongodb/dtos/storage-mongodb.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { Collection } from 'mongodb';

describe('StorageMongoRepository', () => {
  let repository: StorageMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockTenantContextService: jest.Mocked<TenantContextService>;
  let mockStorageMongoDBMapper: jest.Mocked<StorageMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(async () => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      sort: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
      toArray: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockTenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-123'),
    } as unknown as jest.Mocked<TenantContextService>;

    mockStorageMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<StorageMongoDBMapper>;

    repository = new StorageMongoRepository(
      mockMongoMasterService,
      mockTenantContextService,
      mockStorageMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return storage view model when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoDoc: StorageMongoDbDto = {
        id: storageId,
        tenantId: 'test-tenant-123',
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const storageViewModel = new StorageViewModel({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockStorageMongoDBMapper.toViewModel.mockReturnValue(storageViewModel);

      const result = await repository.findById(storageId);

      expect(result).toBe(storageViewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'storages',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: storageId,
        tenantId: 'test-tenant-123',
      });
      expect(mockStorageMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: storageId,
        tenantId: 'test-tenant-123',
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should return null when storage does not exist', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(storageId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: storageId,
        tenantId: 'test-tenant-123',
      });
      expect(mockStorageMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with storages when criteria matches', async () => {
      const now = new Date();
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: StorageMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: 'test-tenant-123',
          fileName: 'file1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          provider: StorageProviderEnum.S3,
          url: 'https://example.com/files/file1.pdf',
          path: 'files/file1.pdf',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          tenantId: 'test-tenant-123',
          fileName: 'file2.pdf',
          fileSize: 2048,
          mimeType: 'application/pdf',
          provider: StorageProviderEnum.S3,
          url: 'https://example.com/files/file2.pdf',
          path: 'files/file2.pdf',
          createdAt: now,
          updatedAt: now,
        },
      ];

      const storageViewModels = mongoDocs.map(
        (doc) =>
          new StorageViewModel({
            id: doc.id,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            provider: doc.provider,
            url: doc.url,
            path: doc.path,
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
      mockStorageMongoDBMapper.toViewModel
        .mockReturnValueOnce(storageViewModels[0])
        .mockReturnValueOnce(storageViewModels[1]);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCollection.countDocuments).toHaveBeenCalled();
      expect(mockStorageMongoDBMapper.toViewModel).toHaveBeenCalledTimes(2);
    });

    it('should return empty paginated result when no storages match criteria', async () => {
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

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockStorageMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save storage view model', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const storageViewModel = new StorageViewModel({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });

      const mongoData: StorageMongoDbDto = {
        id: storageId,
        tenantId: 'test-tenant-123',
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      mockStorageMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(storageViewModel);

      expect(mockStorageMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        storageViewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: storageId, tenantId: 'test-tenant-123' },
        { ...mongoData, tenantId: 'test-tenant-123' },
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete storage view model and return true', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      const result = await repository.delete(storageId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: storageId,
        tenantId: 'test-tenant-123',
      });
    });
  });
});
