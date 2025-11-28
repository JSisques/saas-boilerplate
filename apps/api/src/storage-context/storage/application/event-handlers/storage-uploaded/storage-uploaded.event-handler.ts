import { StorageFileUploadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-uploaded/storage-file-uploaded.event';
import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(StorageFileUploadedEvent)
export class StorageUploadedEventHandler
  implements IEventHandler<StorageFileUploadedEvent>
{
  private readonly logger = new Logger(StorageUploadedEventHandler.name);

  constructor(
    @Inject(STORAGE_READ_REPOSITORY_TOKEN)
    private readonly storageReadRepository: StorageReadRepository,
    private readonly storageViewModelFactory: StorageViewModelFactory,
  ) {}

  async handle(event: StorageFileUploadedEvent): Promise<void> {
    this.logger.log(`Handling storage uploaded event: ${event.aggregateId}`);

    // Create view model from event data
    const viewModel = this.storageViewModelFactory.create({
      id: event.data.id,
      fileName: event.data.fileName,
      fileSize: event.data.fileSize,
      mimeType: event.data.mimeType,
      provider: event.data.provider,
      url: event.data.url,
      path: event.data.path,
      createdAt: event.ocurredAt,
      updatedAt: event.ocurredAt,
    });

    // Save to read repository (MongoDB)
    await this.storageReadRepository.save(viewModel);
  }
}
