import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';
import { StoragePrimitives } from '@/storage-context/storage/domain/primitives/storage.primitives';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Factory class responsible for creating StorageViewModel entities.
 *
 * @remarks
 * This class creates view models from primitive data for read operations.
 */
@Injectable()
export class StorageViewModelFactory
  implements
    IReadFactory<
      StorageViewModel,
      IStorageCreateViewModelDto,
      StorageAggregate,
      StoragePrimitives
    >
{
  private readonly logger = new Logger(StorageViewModelFactory.name);
  /**
   * Creates a new StorageViewModel entity from primitive data.
   *
   * @param data - The storage primitive data.
   * @returns The created storage view model entity.
   */
  public create(data: IStorageCreateViewModelDto): StorageViewModel {
    this.logger.log(`Creating storage view model from data: ${data}`);

    return new StorageViewModel(data);
  }

  /**
   * Creates a new StorageViewModel entity from a storage aggregate.
   *
   * @param storageAggregate - The storage aggregate to create the view model from.
   * @returns The created storage view model entity.
   */
  public fromAggregate(storageAggregate: StorageAggregate): StorageViewModel {
    this.logger.log(
      `Creating storage view model from aggregate: ${storageAggregate}`,
    );

    const now = new Date();

    return new StorageViewModel({
      id: storageAggregate.id.value,
      fileName: storageAggregate.fileName.value,
      fileSize: storageAggregate.fileSize.value,
      mimeType: storageAggregate.mimeType.value,
      provider: storageAggregate.provider.value,
      url: storageAggregate.url.value,
      path: storageAggregate.path.value,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a new StorageViewModel entity from primitive data.
   *
   * @param primitives - The storage primitive data.
   * @returns The created storage view model entity.
   */
  public fromPrimitives(primitives: StoragePrimitives): StorageViewModel {
    this.logger.log(
      `Creating storage view model from primitives: ${primitives}`,
    );

    const now = new Date();

    return new StorageViewModel({
      id: primitives.id,
      fileName: primitives.fileName,
      fileSize: primitives.fileSize,
      mimeType: primitives.mimeType,
      provider: primitives.provider,
      url: primitives.url,
      path: primitives.path,
      createdAt: now,
      updatedAt: now,
    });
  }
}
