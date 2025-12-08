import { StoragePrismaRepository } from '@/storage-context/storage/infrastructure/database/prisma/repositories/storage-prisma.repository';
import { StoragePrismaMapper } from '@/storage-context/storage/infrastructure/database/prisma/mappers/storage-prisma.mapper';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant/prisma-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StoragePrismaDto } from '@/storage-context/storage/infrastructure/database/prisma/dtos/storage-prisma.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';

describe('StoragePrismaRepository', () => {
  let repository: StoragePrismaRepository;
  let mockPrismaTenantService: jest.Mocked<PrismaTenantService>;
  let mockTenantContextService: jest.Mocked<TenantContextService>;
  let mockStoragePrismaMapper: jest.Mocked<StoragePrismaMapper>;
  let mockFindFirst: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;
  let mockClient: any;

  beforeEach(async () => {
    mockFindFirst = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockClient = {
      storage: {
        findFirst: mockFindFirst,
        upsert: mockUpsert,
        delete: mockDelete,
      },
    };

    mockPrismaTenantService = {
      getTenantClient: jest.fn().mockResolvedValue({
        client: mockClient,
      }),
    } as unknown as jest.Mocked<PrismaTenantService>;

    mockTenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-123'),
    } as unknown as jest.Mocked<TenantContextService>;

    mockStoragePrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<StoragePrismaMapper>;

    repository = new StoragePrismaRepository(
      mockPrismaTenantService,
      mockTenantContextService,
      mockStoragePrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return storage aggregate when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: StoragePrismaDto = {
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

      mockFindFirst.mockResolvedValue(prismaData);
      mockStoragePrismaMapper.toDomainEntity.mockReturnValue(storageAggregate);

      const result = await repository.findById(storageId);

      expect(result).toBe(storageAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: storageId },
      });
      expect(mockStoragePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockStoragePrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when storage does not exist', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findById(storageId);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: storageId },
      });
      expect(mockStoragePrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByPath', () => {
    it('should return storage aggregate when storage exists by path', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const path = 'files/test-file.pdf';
      const now = new Date();

      const prismaData: StoragePrismaDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: path,
        createdAt: now,
        updatedAt: now,
      };

      const dto: IStorageCreateDto = {
        id: new StorageUuidValueObject(storageId),
        fileName: new StorageFileNameValueObject('test-file.pdf'),
        fileSize: new StorageFileSizeValueObject(1024),
        mimeType: new StorageMimeTypeValueObject('application/pdf'),
        provider: new StorageProviderValueObject(StorageProviderEnum.S3),
        url: new StorageUrlValueObject(
          'https://example.com/files/test-file.pdf',
        ),
        path: new StoragePathValueObject(path),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const storageAggregate = new StorageAggregate(dto, false);

      mockFindFirst.mockResolvedValue(prismaData);
      mockStoragePrismaMapper.toDomainEntity.mockReturnValue(storageAggregate);

      const result = await repository.findByPath(path);

      expect(result).toBe(storageAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { path },
      });
      expect(mockStoragePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
    });

    it('should return null when storage does not exist by path', async () => {
      const path = 'files/nonexistent-file.pdf';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByPath(path);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { path },
      });
      expect(mockStoragePrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save storage aggregate and return saved aggregate', async () => {
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

      const prismaData: StoragePrismaDto = {
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

      const savedPrismaData: StoragePrismaDto = {
        ...prismaData,
        updatedAt: new Date(),
      };

      const savedStorageAggregate = new StorageAggregate(
        {
          ...dto,
          updatedAt: new DateValueObject(savedPrismaData.updatedAt),
        },
        false,
      );

      mockStoragePrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockStoragePrismaMapper.toDomainEntity.mockReturnValue(
        savedStorageAggregate,
      );

      const result = await repository.save(storageAggregate);

      expect(result).toBe(savedStorageAggregate);
      expect(mockStoragePrismaMapper.toPrismaData).toHaveBeenCalledWith(
        storageAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: storageId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockStoragePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });
  });

  describe('delete', () => {
    it('should delete storage and return true', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue(undefined);

      const result = await repository.delete(storageId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: storageId },
      });
    });
  });
});
