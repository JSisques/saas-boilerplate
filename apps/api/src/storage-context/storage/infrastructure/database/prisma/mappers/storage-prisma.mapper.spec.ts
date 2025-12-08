import { Storage as PrismaStorage } from '@/prisma/tenant/client';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { StoragePrismaMapper } from '@/storage-context/storage/infrastructure/database/prisma/mappers/storage-prisma.mapper';

describe('StoragePrismaMapper', () => {
  let mapper: StoragePrismaMapper;
  let mockStorageAggregateFactory: jest.Mocked<StorageAggregateFactory>;

  beforeEach(() => {
    mockStorageAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<StorageAggregateFactory>;

    mapper = new StoragePrismaMapper(mockStorageAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: PrismaStorage = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3' as any,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageAggregate = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject(
            'https://example.com/files/test-file.pdf',
          ),
          path: new StoragePathValueObject('files/test-file.pdf'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockStorageAggregate);
      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
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
      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert Prisma S3 provider to domain enum', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: PrismaStorage = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3' as any,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageAggregate = {
        id: { value: storageId },
      } as StorageAggregate;

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      mapper.toDomainEntity(prismaData);

      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: StorageProviderEnum.S3,
        }),
      );
    });

    it('should convert Prisma SUPABASE provider to domain enum', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: PrismaStorage = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'SUPABASE' as any,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageAggregate = {
        id: { value: storageId },
      } as StorageAggregate;

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      mapper.toDomainEntity(prismaData);

      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: StorageProviderEnum.SUPABASE,
        }),
      );
    });

    it('should convert Prisma SERVER_ROUTE provider to domain enum', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: PrismaStorage = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'SERVER_ROUTE' as any,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const mockStorageAggregate = {
        id: { value: storageId },
      } as StorageAggregate;

      mockStorageAggregateFactory.fromPrimitives.mockReturnValue(
        mockStorageAggregate,
      );

      mapper.toDomainEntity(prismaData);

      expect(mockStorageAggregateFactory.fromPrimitives).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: StorageProviderEnum.SERVER_ROUTE,
        }),
      );
    });

    it('should throw error for unknown provider', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: PrismaStorage = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'UNKNOWN' as any,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      expect(() => mapper.toDomainEntity(prismaData)).toThrow(
        'Unknown storage provider: UNKNOWN',
      );
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const dto: IStorageCreateDto = {
        id: new StorageUuidValueObject(storageId),
        fileName: new StorageFileNameValueObject('test-file.pdf'),
        fileSize: new StorageFileSizeValueObject(1024),
        mimeType: new StorageMimeTypeValueObject('application/pdf'),
        provider: new StorageProviderValueObject(StorageProviderEnum.S3),
        url: new StorageUrlValueObject(
          'https://example.com/files/test-file.pdf',
        ),
        path: new StoragePathValueObject('files/test-file.pdf'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const storageAggregate = new StorageAggregate(dto, false);

      const result = mapper.toPrismaData(storageAggregate);

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

    it('should convert domain entity with different provider to Prisma data', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const dto: IStorageCreateDto = {
        id: new StorageUuidValueObject(storageId),
        fileName: new StorageFileNameValueObject('test-file.pdf'),
        fileSize: new StorageFileSizeValueObject(1024),
        mimeType: new StorageMimeTypeValueObject('application/pdf'),
        provider: new StorageProviderValueObject(StorageProviderEnum.SUPABASE),
        url: new StorageUrlValueObject(
          'https://example.com/files/test-file.pdf',
        ),
        path: new StoragePathValueObject('files/test-file.pdf'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const storageAggregate = new StorageAggregate(dto, false);

      const result = mapper.toPrismaData(storageAggregate);

      expect(result.provider).toBe(StorageProviderEnum.SUPABASE);
    });
  });
});
