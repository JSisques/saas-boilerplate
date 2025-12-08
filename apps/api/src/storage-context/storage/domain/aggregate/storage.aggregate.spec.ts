import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';
import { IStorageUpdateDto } from '@/storage-context/storage/domain/dtos/entities/storage-update/storage-update.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { StorageCreatedEvent } from '@/shared/domain/events/storage-context/storage/storage-created/storage-created.event';
import { StorageFileDeletedEvent } from '@/shared/domain/events/storage-context/storage/storage-deleted/storage-deleted.event';
import { StorageFileDownloadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-downloaded/storage-file-downloaded.event';
import { StorageFileUploadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-uploaded/storage-file-uploaded.event';
import { StorageUpdatedEvent } from '@/shared/domain/events/storage-context/storage/storage-updated/storage-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';

describe('StorageAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): StorageAggregate => {
    const now = new Date();
    const dto: IStorageCreateDto = {
      id: new StorageUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      fileName: new StorageFileNameValueObject('test-file.pdf'),
      fileSize: new StorageFileSizeValueObject(1024),
      mimeType: new StorageMimeTypeValueObject('application/pdf'),
      provider: new StorageProviderValueObject(StorageProviderEnum.S3),
      url: new StorageUrlValueObject('https://example.com/files/test-file.pdf'),
      path: new StoragePathValueObject('files/test-file.pdf'),
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    };

    return new StorageAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a StorageAggregate with all properties', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(StorageAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.fileName.value).toBe('test-file.pdf');
      expect(aggregate.fileSize.value).toBe(1024);
      expect(aggregate.mimeType.value).toBe('application/pdf');
      expect(aggregate.provider.value).toBe(StorageProviderEnum.S3);
      expect(aggregate.url.value).toBe(
        'https://example.com/files/test-file.pdf',
      );
      expect(aggregate.path.value).toBe('files/test-file.pdf');
    });

    it('should emit StorageCreatedEvent on creation by default', () => {
      const aggregate = createBaseAggregate(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(StorageCreatedEvent);

      const event = events[0] as StorageCreatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(StorageAggregate.name);
      expect(event.eventType).toBe(StorageCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit StorageCreatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.id).toBeInstanceOf(StorageUuidValueObject);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should expose fileName via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.fileName).toBeInstanceOf(StorageFileNameValueObject);
      expect(aggregate.fileName.value).toBe('test-file.pdf');
    });

    it('should expose fileSize via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.fileSize).toBeInstanceOf(StorageFileSizeValueObject);
      expect(aggregate.fileSize.value).toBe(1024);
    });

    it('should expose mimeType via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.mimeType).toBeInstanceOf(StorageMimeTypeValueObject);
      expect(aggregate.mimeType.value).toBe('application/pdf');
    });

    it('should expose provider via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.provider).toBeInstanceOf(StorageProviderValueObject);
      expect(aggregate.provider.value).toBe(StorageProviderEnum.S3);
    });

    it('should expose url via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.url).toBeInstanceOf(StorageUrlValueObject);
      expect(aggregate.url.value).toBe(
        'https://example.com/files/test-file.pdf',
      );
    });

    it('should expose path via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.path).toBeInstanceOf(StoragePathValueObject);
      expect(aggregate.path.value).toBe('files/test-file.pdf');
    });
  });

  describe('update', () => {
    it('should update fileName when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const originalFileName = aggregate.fileName.value;
      const newFileName = new StorageFileNameValueObject('updated-file.pdf');

      aggregate.update({ fileName: newFileName }, false);

      expect(aggregate.fileName.value).toBe('updated-file.pdf');
      expect(aggregate.fileName.value).not.toBe(originalFileName);
    });

    it('should keep original fileName when undefined is provided', () => {
      const aggregate = createBaseAggregate();
      const originalFileName = aggregate.fileName.value;

      aggregate.update({ fileName: undefined }, false);

      expect(aggregate.fileName.value).toBe(originalFileName);
    });

    it('should update fileSize when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newFileSize = new StorageFileSizeValueObject(2048);

      aggregate.update({ fileSize: newFileSize }, false);

      expect(aggregate.fileSize.value).toBe(2048);
    });

    it('should update mimeType when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newMimeType = new StorageMimeTypeValueObject('image/png');

      aggregate.update({ mimeType: newMimeType }, false);

      expect(aggregate.mimeType.value).toBe('image/png');
    });

    it('should update provider when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newProvider = new StorageProviderValueObject(
        StorageProviderEnum.SUPABASE,
      );

      aggregate.update({ provider: newProvider }, false);

      expect(aggregate.provider.value).toBe(StorageProviderEnum.SUPABASE);
    });

    it('should update url when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newUrl = new StorageUrlValueObject(
        'https://example.com/new-url.pdf',
      );

      aggregate.update({ url: newUrl }, false);

      expect(aggregate.url.value).toBe('https://example.com/new-url.pdf');
    });

    it('should update path when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newPath = new StoragePathValueObject('new-path/file.pdf');

      aggregate.update({ path: newPath }, false);

      expect(aggregate.path.value).toBe('new-path/file.pdf');
    });

    it('should update multiple fields at once', () => {
      const aggregate = createBaseAggregate();
      const updateDto: IStorageUpdateDto = {
        fileName: new StorageFileNameValueObject('updated-file.pdf'),
        fileSize: new StorageFileSizeValueObject(4096),
        mimeType: new StorageMimeTypeValueObject('image/jpeg'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.fileName.value).toBe('updated-file.pdf');
      expect(aggregate.fileSize.value).toBe(4096);
      expect(aggregate.mimeType.value).toBe('image/jpeg');
    });

    it('should generate StorageUpdatedEvent when updating with generateEvent true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event
      const newFileName = new StorageFileNameValueObject('updated-file.pdf');

      aggregate.update({ fileName: newFileName }, true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(StorageUpdatedEvent);

      const event = events[0] as StorageUpdatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(StorageAggregate.name);
      expect(event.eventType).toBe(StorageUpdatedEvent.name);
      expect(event.data.fileName).toBe('updated-file.pdf');
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.update(
        { fileName: new StorageFileNameValueObject('updated.pdf') },
        false,
      );

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should generate StorageFileDeletedEvent when deleting with generateEvent true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(StorageFileDeletedEvent);

      const event = events[0] as StorageFileDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(StorageAggregate.name);
      expect(event.eventType).toBe(StorageFileDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('markAsDownloaded', () => {
    it('should generate StorageFileDownloadedEvent when marking as downloaded with generateEvent true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.markAsDownloaded(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(StorageFileDownloadedEvent);

      const event = events[0] as StorageFileDownloadedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(StorageAggregate.name);
      expect(event.eventType).toBe(StorageFileDownloadedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsDownloaded(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('markAsUploaded', () => {
    it('should generate StorageFileUploadedEvent when marking as uploaded with generateEvent true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.markAsUploaded(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(StorageFileUploadedEvent);

      const event = events[0] as StorageFileUploadedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(StorageAggregate.name);
      expect(event.eventType).toBe(StorageFileUploadedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsUploaded(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitive representation', () => {
      const aggregate = createBaseAggregate();
      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: aggregate.id.value,
        fileName: aggregate.fileName.value,
        fileSize: aggregate.fileSize.value,
        mimeType: aggregate.mimeType.value,
        provider: aggregate.provider.value,
        url: aggregate.url.value,
        path: aggregate.path.value,
        createdAt: aggregate.createdAt.value,
        updatedAt: aggregate.updatedAt.value,
      });
    });

    it('should include all fields in primitives', () => {
      const now = new Date();
      const dto: IStorageCreateDto = {
        id: new StorageUuidValueObject(),
        fileName: new StorageFileNameValueObject('document.pdf'),
        fileSize: new StorageFileSizeValueObject(5120),
        mimeType: new StorageMimeTypeValueObject('application/pdf'),
        provider: new StorageProviderValueObject(StorageProviderEnum.SUPABASE),
        url: new StorageUrlValueObject(
          'https://supabase.com/files/document.pdf',
        ),
        path: new StoragePathValueObject('documents/document.pdf'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new StorageAggregate(dto, false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.id).toBe(dto.id.value);
      expect(primitives.fileName).toBe('document.pdf');
      expect(primitives.fileSize).toBe(5120);
      expect(primitives.mimeType).toBe('application/pdf');
      expect(primitives.provider).toBe(StorageProviderEnum.SUPABASE);
      expect(primitives.url).toBe('https://supabase.com/files/document.pdf');
      expect(primitives.path).toBe('documents/document.pdf');
    });
  });
});
