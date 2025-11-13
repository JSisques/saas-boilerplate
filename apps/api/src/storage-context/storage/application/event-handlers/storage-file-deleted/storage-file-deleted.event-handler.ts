import { StorageFileDeletedEvent } from '@/shared/domain/events/storage-context/storage/storage-deleted/storage-deleted.event';
import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(StorageFileDeletedEvent)
export class StorageFileDeletedEventHandler
  implements IEventHandler<StorageFileDeletedEvent>
{
  private readonly logger = new Logger(StorageFileDeletedEventHandler.name);

  constructor(
    @Inject(STORAGE_READ_REPOSITORY_TOKEN)
    private readonly storageReadRepository: StorageReadRepository,
    private readonly assertStorageViewModelExsistsService: AssertStorageViewModelExsistsService,
  ) {}

  async handle(event: StorageFileDeletedEvent): Promise<void> {
    this.logger.log(`Handling storage deleted event: ${event.aggregateId}`);

    // 01: Assert the storage view model exists
    const existingStorageViewModel =
      await this.assertStorageViewModelExsistsService.execute(
        event.aggregateId,
      );

    // 02: Delete the storage view model
    await this.storageReadRepository.delete(existingStorageViewModel.id);
  }
}
