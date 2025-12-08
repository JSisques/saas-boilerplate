import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';
import { StoragePrimitives } from '@/storage-context/storage/domain/primitives/storage.primitives';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { StorageCreatedEvent } from '@/shared/domain/events/storage-context/storage/storage-created/storage-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';

describe('StorageAggregateFactory', () => {
  let factory: StorageAggregateFactory;

  beforeEach(() => {
    factory = new StorageAggregateFactory();
  });

  describe('create', () => {
    it('should create a StorageAggregate from DTO with all fields and generate event by default', () => {
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

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(StorageAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.fileName.value).toBe(dto.fileName.value);
      expect(aggregate.fileSize.value).toBe(dto.fileSize.value);
      expect(aggregate.mimeType.value).toBe(dto.mimeType.value);
      expect(aggregate.provider.value).toBe(dto.provider.value);
      expect(aggregate.url.value).toBe(dto.url.value);
      expect(aggregate.path.value).toBe(dto.path.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(StorageCreatedEvent);
    });

    it('should create a StorageAggregate from DTO without generating event when generateEvent is false', () => {
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

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(StorageAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.fileName.value).toBe(dto.fileName.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a StorageAggregate from primitives with all fields', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(StorageAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.fileName.value).toBe(primitives.fileName);
      expect(aggregate.fileSize.value).toBe(primitives.fileSize);
      expect(aggregate.mimeType.value).toBe(primitives.mimeType);
      expect(aggregate.provider.value).toBe(primitives.provider);
      expect(aggregate.url.value).toBe(primitives.url);
      expect(aggregate.path.value).toBe(primitives.path);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a StorageAggregate from primitives without generating event by default', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      // Check that no event was generated by default
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a StorageAggregate from primitives with different provider values', () => {
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

        const aggregate = factory.fromPrimitives(primitives);

        expect(aggregate.provider.value).toBe(provider);
      });
    });

    it('should create a StorageAggregate from primitives with generateEvent true', () => {
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

      const aggregate = factory.fromPrimitives(primitives, true);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(StorageCreatedEvent);
    });
  });
});
