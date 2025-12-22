import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
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
import { StorageTypeormRepository } from '@/storage-context/storage/infrastructure/database/typeorm/repositories/storage-typeorm.repository';
import { DataSource, Repository } from 'typeorm';

describe('StorageTypeormRepository', () => {
  let repository: StorageTypeormRepository;
  let mockTypeormTenantService: jest.Mocked<TypeormTenantService>;
  let mockTenantContextService: jest.Mocked<TenantContextService>;
  let mockStorageTypeormMapper: jest.Mocked<StorageTypeormMapper>;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockTypeormRepository: jest.Mocked<Repository<StorageTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;
  let mockGetRepository: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();
    mockGetRepository = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<StorageTypeormEntity>>;

    mockDataSource = {
      getRepository: mockGetRepository.mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<DataSource>;

    mockTypeormTenantService = {
      getTenantDataSource: jest.fn().mockResolvedValue(mockDataSource),
    } as unknown as jest.Mocked<TypeormTenantService>;

    mockTenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-id'),
    } as unknown as jest.Mocked<TenantContextService>;

    mockStorageTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<StorageTypeormMapper>;

    repository = new StorageTypeormRepository(
      mockTypeormTenantService,
      mockTenantContextService,
      mockStorageTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return storage aggregate when storage exists', async () => {
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockStorageTypeormMapper.toDomainEntity.mockReturnValue(storageAggregate);

      const result = await repository.findById(storageId);

      expect(result).toBe(storageAggregate);
      expect(mockTenantContextService.getTenantIdOrThrow).toHaveBeenCalled();
      expect(mockTypeormTenantService.getTenantDataSource).toHaveBeenCalledWith(
        'test-tenant-id',
      );
      expect(mockGetRepository).toHaveBeenCalledWith(StorageTypeormEntity);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: storageId },
      });
      expect(mockStorageTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockStorageTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when storage does not exist', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(storageId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: storageId },
      });
      expect(mockStorageTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByPath', () => {
    it('should return storage aggregate when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const path = '/uploads/test-file.pdf';
      const now = new Date();

      const typeormEntity = new StorageTypeormEntity();
      typeormEntity.id = storageId;
      typeormEntity.fileName = 'test-file.pdf';
      typeormEntity.fileSize = 1024;
      typeormEntity.mimeType = 'application/pdf';
      typeormEntity.provider = StorageProviderEnum.S3;
      typeormEntity.url = 'https://example.com/file.pdf';
      typeormEntity.path = path;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const storageAggregate = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject('https://example.com/file.pdf'),
          path: new StoragePathValueObject(path),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockStorageTypeormMapper.toDomainEntity.mockReturnValue(storageAggregate);

      const result = await repository.findByPath(path);

      expect(result).toBe(storageAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { path },
      });
      expect(mockStorageTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockStorageTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when storage does not exist', async () => {
      const path = '/uploads/non-existent-file.pdf';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findByPath(path);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { path },
      });
      expect(mockStorageTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save storage aggregate and return saved aggregate', async () => {
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

      const savedTypeormEntity = new StorageTypeormEntity();
      savedTypeormEntity.id = storageId;
      savedTypeormEntity.fileName = 'test-file.pdf';
      savedTypeormEntity.fileSize = 1024;
      savedTypeormEntity.mimeType = 'application/pdf';
      savedTypeormEntity.provider = StorageProviderEnum.S3;
      savedTypeormEntity.url = 'https://example.com/file.pdf';
      savedTypeormEntity.path = '/uploads/test-file.pdf';
      savedTypeormEntity.createdAt = now;
      savedTypeormEntity.updatedAt = now;
      savedTypeormEntity.deletedAt = null;

      const savedStorageAggregate = new StorageAggregate(
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

      mockStorageTypeormMapper.toTypeormEntity.mockReturnValue({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/file.pdf',
        path: '/uploads/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      } as Partial<StorageTypeormEntity>);

      mockSave.mockResolvedValue(savedTypeormEntity);
      mockStorageTypeormMapper.toDomainEntity.mockReturnValue(
        savedStorageAggregate,
      );

      const result = await repository.save(storageAggregate);

      expect(result).toBe(savedStorageAggregate);
      expect(mockStorageTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        storageAggregate,
      );
      expect(mockSave).toHaveBeenCalled();
      expect(mockStorageTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockStorageTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete storage and return true', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue(undefined);

      const result = await repository.delete(storageId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(storageId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });
  });
});
