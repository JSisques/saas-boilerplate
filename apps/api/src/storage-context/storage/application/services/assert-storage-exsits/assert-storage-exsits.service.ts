import { IBaseService } from '@/shared/application/services/base-service.interface';
import { StorageNotFoundException } from '@/storage-context/storage/application/exceptions/storage-not-found/storage-not-found.exception';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertStorageExsistsService
  implements IBaseService<string, StorageAggregate>
{
  private readonly logger = new Logger(AssertStorageExsistsService.name);

  constructor(
    @Inject(STORAGE_WRITE_REPOSITORY_TOKEN)
    private readonly storageWriteRepository: StorageWriteRepository,
  ) {}

  /**
   * Asserts that a storage exists by id.
   *
   * @param id - The id of the storage to assert.
   * @returns The storage aggregate.
   */
  async execute(id: string): Promise<StorageAggregate> {
    this.logger.log(`Asserting storage exists by id: ${id}`);

    // 01: Find the storage by id
    const existingStorage = await this.storageWriteRepository.findById(id);

    // 02: If the storage does not exist, throw an error
    if (!existingStorage) {
      this.logger.error(`Storage not found by id: ${id}`);
      throw new StorageNotFoundException(id);
    }

    return existingStorage;
  }
}
