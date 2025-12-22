import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { StorageTypeormMapper } from '@/storage-context/storage/infrastructure/database/typeorm/mappers/storage-typeorm.mapper';

describe('StorageTypeormMapper', () => {
  let mapper: StorageTypeormMapper;
  let mockStorageAggregateFactory: jest.Mocked<StorageAggregateFactory>;

  beforeEach(() => {
    mockStorageAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<StorageAggregateFactory>;

    mapper = new StorageTypeormMapper(mockStorageAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new StorageTypeormEntity();
      typeormEntity.id = storageId;
      typeormEntity.fileName = 'test-file.pdf';
      typeormEntity.fileSize = 1024;
      typeormEntity.mimeType = 'application/pdf';
      typeormEntity.provider = StorageProviderEnum.S3;
      typeormEntity.url = 'https://example.com/file.pdf';
      typeormEntity.path = '/uploads/test-file.pdf';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockStorageAggregate = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject('https://example.com/file.pdf'),
          path: new StoragePathValueObject('/uploads/test-file.pdf'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockStorageAggregate);
      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024, // Converted from BigInt
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/file.pdf',
        path: '/uploads/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });
      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert TypeORM entity with SUPABASE provider', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new StorageTypeormEntity();
      typeormEntity.id = storageId;
      typeormEntity.fileName = 'test-file.jpg';
      typeormEntity.fileSize = 2048;
      typeormEntity.mimeType = 'image/jpeg';
      typeormEntity.provider = StorageProviderEnum.SUPABASE;
      typeormEntity.url = 'https://supabase.com/file.jpg';
      typeormEntity.path = '/uploads/test-file.jpg';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockStorageAggregate = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.jpg'),
          fileSize: new StorageFileSizeValueObject(2048),
          mimeType: new StorageMimeTypeValueObject('image/jpeg'),
          provider: new StorageProviderValueObject(
            StorageProviderEnum.SUPABASE,
          ),
          url: new StorageUrlValueObject('https://supabase.com/file.jpg'),
          path: new StoragePathValueObject('/uploads/test-file.jpg'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockStorageAggregate);
      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: storageId,
        fileName: 'test-file.jpg',
        fileSize: 2048,
        mimeType: 'image/jpeg',
        provider: StorageProviderEnum.SUPABASE,
        url: 'https://supabase.com/file.jpg',
        path: '/uploads/test-file.jpg',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert TypeORM entity with SERVER_ROUTE provider', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new StorageTypeormEntity();
      typeormEntity.id = storageId;
      typeormEntity.fileName = 'test-file.png';
      typeormEntity.fileSize = 4096;
      typeormEntity.mimeType = 'image/png';
      typeormEntity.provider = StorageProviderEnum.SERVER_ROUTE;
      typeormEntity.url = 'https://example.com/api/files/test-file.png';
      typeormEntity.path = '/uploads/test-file.png';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockStorageAggregate = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.png'),
          fileSize: new StorageFileSizeValueObject(4096),
          mimeType: new StorageMimeTypeValueObject('image/png'),
          provider: new StorageProviderValueObject(
            StorageProviderEnum.SERVER_ROUTE,
          ),
          url: new StorageUrlValueObject(
            'https://example.com/api/files/test-file.png',
          ),
          path: new StoragePathValueObject('/uploads/test-file.png'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockStorageAggregate);
      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: storageId,
        fileName: 'test-file.png',
        fileSize: 4096,
        mimeType: 'image/png',
        provider: StorageProviderEnum.SERVER_ROUTE,
        url: '/api/files/test-file.png',
        path: '/uploads/test-file.png',
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert storage aggregate to TypeORM entity', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const storageAggregate = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject('https://example.com/file.pdf'),
          path: new StoragePathValueObject('/uploads/test-file.pdf'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      // Mock toPrimitives method
      jest.spyOn(storageAggregate, 'toPrimitives').mockReturnValue({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/file.pdf',
        path: '/uploads/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toTypeormEntity(storageAggregate);

      expect(result).toEqual({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/file.pdf',
        path: '/uploads/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert storage aggregate with all provider types', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const providers = [
        StorageProviderEnum.S3,
        StorageProviderEnum.SUPABASE,
        StorageProviderEnum.SERVER_ROUTE,
      ];

      providers.forEach((provider) => {
        const storageAggregate = new StorageAggregate(
          {
            id: new StorageUuidValueObject(storageId),
            fileName: new StorageFileNameValueObject('test-file.pdf'),
            fileSize: new StorageFileSizeValueObject(1024),
            mimeType: new StorageMimeTypeValueObject('application/pdf'),
            provider: new StorageProviderValueObject(provider),
            url: new StorageUrlValueObject('https://example.com/file.pdf'),
            path: new StoragePathValueObject('/uploads/test-file.pdf'),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        jest.spyOn(storageAggregate, 'toPrimitives').mockReturnValue({
          id: storageId,
          fileName: 'test-file.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          provider: provider,
          url: 'https://example.com/file.pdf',
          path: '/uploads/test-file.pdf',
          createdAt: now,
          updatedAt: now,
        });

        const result = mapper.toTypeormEntity(storageAggregate);

        expect(result.provider).toBe(provider);
      });
    });
  });
});
