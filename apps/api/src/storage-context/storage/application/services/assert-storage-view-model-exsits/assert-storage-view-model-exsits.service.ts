import { IBaseService } from '@/shared/application/services/base-service.interface';
import { StorageNotFoundException } from '@/storage-context/storage/application/exceptions/storage-not-found/storage-not-found.exception';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertStorageViewModelExsistsService
  implements IBaseService<string, StorageViewModel>
{
  private readonly logger = new Logger(
    AssertStorageViewModelExsistsService.name,
  );

  constructor(
    @Inject(STORAGE_READ_REPOSITORY_TOKEN)
    private readonly storageReadRepository: StorageReadRepository,
  ) {}

  /**
   * Asserts that a storage view model exists by id.
   *
   * @param id - The id of the storage view model to assert.
   * @returns The storage view model.
   * @throws StorageNotFoundException if the storage view model does not exist.
   */
  async execute(id: string): Promise<StorageViewModel> {
    this.logger.log(`Asserting storage view model exists by id: ${id}`);

    // 01: Find the storage by id
    const existingStorageViewModel =
      await this.storageReadRepository.findById(id);

    // 02: If the storage view model does not exist, throw an error
    if (!existingStorageViewModel) {
      this.logger.error(`Storage view model not found by id: ${id}`);
      throw new StorageNotFoundException(id);
    }

    return existingStorageViewModel;
  }
}
