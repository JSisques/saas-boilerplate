import { StorageMongoDBMapper } from '@/storage-context/storage/infrastructure/database/mongodb/mappers/storage-mongodb.mapper';
import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageMongoDbDto } from '@/storage-context/storage/infrastructure/database/mongodb/dtos/storage-mongodb.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';

describe('StorageMongoDBMapper', () => {
  let mapper: StorageMongoDBMapper;
  let mockStorageViewModelFactory: jest.Mocked<StorageViewModelFactory>;

  beforeEach(() => {
    mockStorageViewModelFactory = {
      create: jest.fn(),
      fromAggregate: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<StorageViewModelFactory>;

    mapper = new StorageMongoDBMapper(mockStorageViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoDoc: StorageMongoDbDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageViewModel = {
        id: storageId,
        fileName: 'test-file.pdf',
      } as StorageViewModel;

      mockStorageViewModelFactory.create.mockReturnValue(mockStorageViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockStorageViewModel);
      expect(mockStorageViewModelFactory.create).toHaveBeenCalledWith({
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
      expect(mockStorageViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document with different provider to view model', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoDoc: StorageMongoDbDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.SUPABASE,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageViewModel = {
        id: storageId,
      } as StorageViewModel;

      mockStorageViewModelFactory.create.mockReturnValue(mockStorageViewModel);

      mapper.toViewModel(mongoDoc);

      expect(mockStorageViewModelFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: StorageProviderEnum.SUPABASE,
        }),
      );
    });

    it('should convert Date objects from MongoDB document', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const mongoDoc: StorageMongoDbDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageViewModel = {
        id: storageId,
      } as StorageViewModel;

      mockStorageViewModelFactory.create.mockReturnValue(mockStorageViewModel);

      mapper.toViewModel(mongoDoc);

      expect(mockStorageViewModelFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: now,
          updatedAt: now,
        }),
      );
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all properties', () => {
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

      const result = mapper.toMongoData(storageViewModel);

      expect(result).toEqual({
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
    });

    it('should convert view model with different provider to MongoDB document', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const storageViewModel = new StorageViewModel({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.SUPABASE,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(storageViewModel);

      expect(result.provider).toBe(StorageProviderEnum.SUPABASE);
    });
  });
});
