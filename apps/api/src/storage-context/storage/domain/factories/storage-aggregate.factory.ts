import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageCreateDto } from '@/storage-context/storage/domain/dtos/entities/storage-create/storage-create.dto';
import { StoragePrimitives } from '@/storage-context/storage/domain/primitives/storage.primitives';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Factory class responsible for creating StorageAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate storage information.
 */
@Injectable()
export class StorageAggregateFactory
  implements
    IWriteFactory<StorageAggregate, IStorageCreateDto, StoragePrimitives>
{
  private readonly logger = new Logger(StorageAggregateFactory.name);

  /**
   * Creates a new StorageAggregate entity using the provided create data.
   *
   * @param data - The storage create data.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {StorageAggregate} - The created storage aggregate entity.
   */
  public create(
    data: IStorageCreateDto,
    generateEvent: boolean = true,
  ): StorageAggregate {
    this.logger.log(`Creating storage aggregate from data: ${data}`);

    return new StorageAggregate(data, generateEvent);
  }

  /**
   * Creates a new StorageAggregate entity from primitive data.
   *
   * @param data - The storage primitive data.
   * @returns The created storage aggregate entity.
   */
  public fromPrimitives(
    primitives: StoragePrimitives,
    generateEvent: boolean = false,
  ): StorageAggregate {
    this.logger.log(
      `Creating storage aggregate from primitives: ${primitives}`,
    );

    return new StorageAggregate(
      {
        id: new StorageUuidValueObject(primitives.id),
        fileName: new StorageFileNameValueObject(primitives.fileName),
        fileSize: new StorageFileSizeValueObject(primitives.fileSize),
        mimeType: new StorageMimeTypeValueObject(primitives.mimeType),
        provider: new StorageProviderValueObject(primitives.provider),
        url: new StorageUrlValueObject(primitives.url),
        path: new StoragePathValueObject(primitives.path),
      },
      generateEvent,
    );
  }
}
