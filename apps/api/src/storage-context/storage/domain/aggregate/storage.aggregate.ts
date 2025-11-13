import { StorageCreatedEvent } from '@/shared/domain/events/storage-context/storage/storage-created/storage-created.event';
import { StorageFileDeletedEvent } from '@/shared/domain/events/storage-context/storage/storage-deleted/storage-deleted.event';
import { StorageFileDownloadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-downloaded/storage-file-downloaded.event';
import { StorageFileUploadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-uploaded/storage-file-uploaded.event';
import { StorageUpdatedEvent } from '@/shared/domain/events/storage-context/storage/storage-updated/storage-updated.event';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';
import { IStorageUpdateDto } from '@/storage-context/storage/domain/dtos/entities/storage-update/storage-update.dto';
import { StoragePrimitives } from '@/storage-context/storage/domain/primitives/storage.primitives';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class StorageAggregate extends AggregateRoot {
  private readonly _id: StorageUuidValueObject;
  private _fileName: StorageFileNameValueObject;
  private _fileSize: StorageFileSizeValueObject;
  private _mimeType: StorageMimeTypeValueObject;
  private _provider: StorageProviderValueObject;
  private _url: StorageUrlValueObject;
  private _path: StoragePathValueObject;

  constructor(props: IStorageCreateDto, generateEvent: boolean = true) {
    super();

    // 01: Set the properties
    this._id = props.id;
    this._fileName = props.fileName;
    this._fileSize = props.fileSize;
    this._mimeType = props.mimeType;
    this._provider = props.provider;
    this._url = props.url;
    this._path = props.path;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new StorageCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: StorageAggregate.name,
            eventType: StorageCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the storage.
   *
   * @param props - The properties to update the storage.
   * @param generateEvent - Whether to generate the storage updated event. Default is true.
   */
  public update(props: IStorageUpdateDto, generateEvent: boolean = true) {
    this._fileName =
      props.fileName !== undefined ? props.fileName : this._fileName;
    this._fileSize =
      props.fileSize !== undefined ? props.fileSize : this._fileSize;
    this._mimeType =
      props.mimeType !== undefined ? props.mimeType : this._mimeType;
    this._provider =
      props.provider !== undefined ? props.provider : this._provider;
    this._url = props.url !== undefined ? props.url : this._url;
    this._path = props.path !== undefined ? props.path : this._path;

    if (generateEvent) {
      this.apply(
        new StorageUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: StorageAggregate.name,
            eventType: StorageUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the storage.
   *
   * @param generateEvent - Whether to generate the delete event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new StorageFileDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: StorageAggregate.name,
            eventType: StorageFileDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark file as downloaded.
   *
   * @param generateEvent - Whether to generate the download event. Default is true.
   */
  public markAsDownloaded(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new StorageFileDownloadedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: StorageAggregate.name,
            eventType: StorageFileDownloadedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark file as uploaded.
   *
   * @param generateEvent - Whether to generate the upload event. Default is true.
   */
  public markAsUploaded(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new StorageFileUploadedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: StorageAggregate.name,
            eventType: StorageFileUploadedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  public get id(): StorageUuidValueObject {
    return this._id;
  }

  public get fileName(): StorageFileNameValueObject {
    return this._fileName;
  }

  public get fileSize(): StorageFileSizeValueObject {
    return this._fileSize;
  }

  public get mimeType(): StorageMimeTypeValueObject {
    return this._mimeType;
  }

  public get provider(): StorageProviderValueObject {
    return this._provider;
  }

  public get url(): StorageUrlValueObject {
    return this._url;
  }

  public get path(): StoragePathValueObject {
    return this._path;
  }

  /**
   * Convert the storage aggregate to primitives.
   *
   * @returns The primitives of the storage.
   */
  public toPrimitives(): StoragePrimitives {
    return {
      id: this._id.value,
      fileName: this._fileName.value,
      fileSize: this._fileSize.value,
      mimeType: this._mimeType.value,
      provider: this._provider.value,
      url: this._url.value,
      path: this._path.value,
    };
  }
}
