import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';
import { StoragePrimitives } from '@/storage-context/storage/domain/primitives/storage.primitives';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';

describe('StorageViewModelFactory', () => {
  let factory: StorageViewModelFactory;

  beforeEach(() => {
    factory = new StorageViewModelFactory();
  });

  describe('create', () => {
    it('should create a StorageViewModel from DTO', () => {
      const now = new Date();
      const dto: IStorageCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(StorageViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.fileName).toBe(dto.fileName);
      expect(viewModel.fileSize).toBe(dto.fileSize);
      expect(viewModel.mimeType).toBe(dto.mimeType);
      expect(viewModel.provider).toBe(dto.provider);
      expect(viewModel.url).toBe(dto.url);
      expect(viewModel.path).toBe(dto.path);
      expect(viewModel.createdAt).toBe(dto.createdAt);
      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });
  });

  describe('fromAggregate', () => {
    it('should create a StorageViewModel from StorageAggregate', () => {
      const now = new Date();
      const dto: IStorageCreateDto = {
        id: new StorageUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
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
      const aggregate = new StorageAggregate(dto, false);

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(StorageViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.fileName).toBe(aggregate.fileName.value);
      expect(viewModel.fileSize).toBe(aggregate.fileSize.value);
      expect(viewModel.mimeType).toBe(aggregate.mimeType.value);
      expect(viewModel.provider).toBe(aggregate.provider.value);
      expect(viewModel.url).toBe(aggregate.url.value);
      expect(viewModel.path).toBe(aggregate.path.value);
      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
    });

    it('should use current date for createdAt and updatedAt when creating from aggregate', () => {
      const now = new Date();
      const dto: IStorageCreateDto = {
        id: new StorageUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
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
      const aggregate = new StorageAggregate(dto, false);
      const beforeCreation = new Date();

      const viewModel = factory.fromAggregate(aggregate);

      const afterCreation = new Date();
      expect(viewModel.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(viewModel.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('fromPrimitives', () => {
    it('should create a StorageViewModel from primitives', () => {
      const now = new Date();
      const primitives: StoragePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(StorageViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.fileName).toBe(primitives.fileName);
      expect(viewModel.fileSize).toBe(primitives.fileSize);
      expect(viewModel.mimeType).toBe(primitives.mimeType);
      expect(viewModel.provider).toBe(primitives.provider);
      expect(viewModel.url).toBe(primitives.url);
      expect(viewModel.path).toBe(primitives.path);
      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
    });

    it('should use current date for createdAt and updatedAt when creating from primitives', () => {
      const now = new Date();
      const primitives: StoragePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: now,
        updatedAt: now,
      };
      const beforeCreation = new Date();

      const viewModel = factory.fromPrimitives(primitives);

      const afterCreation = new Date();
      expect(viewModel.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(viewModel.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should create a StorageViewModel from primitives with different provider values', () => {
      const now = new Date();
      const providers = [
        StorageProviderEnum.S3,
        StorageProviderEnum.SUPABASE,
        StorageProviderEnum.SERVER_ROUTE,
      ];

      providers.forEach((provider) => {
        const primitives: StoragePrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          fileName: 'test-file.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          provider: provider,
          url: 'https://example.com/files/test-file.pdf',
          path: 'files/test-file.pdf',
          createdAt: now,
          updatedAt: now,
        };

        const viewModel = factory.fromPrimitives(primitives);

        expect(viewModel.provider).toBe(provider);
      });
    });
  });
});
