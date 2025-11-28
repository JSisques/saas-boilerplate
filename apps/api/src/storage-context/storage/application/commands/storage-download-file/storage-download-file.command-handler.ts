import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { StorageDownloadFileCommand } from './storage-download-file.command';

@CommandHandler(StorageDownloadFileCommand)
export class StorageDownloadFileCommandHandler
  implements ICommandHandler<StorageDownloadFileCommand>
{
  private readonly logger = new Logger(StorageDownloadFileCommandHandler.name);

  constructor(
    @Inject(STORAGE_WRITE_REPOSITORY_TOKEN)
    private readonly storageWriteRepository: StorageWriteRepository,
    private readonly storageProviderFactory: StorageProviderFactoryService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Executes the storage download file command
   *
   * @param command - The command to execute
   * @returns The file buffer
   */
  async execute(command: StorageDownloadFileCommand): Promise<Buffer> {
    this.logger.log(
      `Executing storage download file command: ${command.id.value}`,
    );

    // 01: Find the storage entity
    const storage = await this.storageWriteRepository.findById(
      command.id.value,
    );

    if (!storage) {
      this.logger.error(`Storage not found: ${command.id.value}`);
      // TODO: Throw a specific exception
      throw new Error('Storage not found');
    }

    // 02: Get the storage provider
    const provider = this.storageProviderFactory.getProvider(
      storage.provider.value as any,
    );

    // 03: Download file from storage provider
    const fileBuffer = await provider.download(storage.path.value);

    // 04: Mark as downloaded and publish event
    storage.markAsDownloaded();
    await this.eventBus.publishAll(storage.getUncommittedEvents());
    await storage.commit();

    // 05: Return the file buffer
    return fileBuffer;
  }
}
