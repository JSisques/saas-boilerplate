import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StorageDeleteFileCommand } from './storage-delete-file.command';

@CommandHandler(StorageDeleteFileCommand)
export class StorageDeleteFileCommandHandler
  implements ICommandHandler<StorageDeleteFileCommand>
{
  private readonly logger = new Logger(StorageDeleteFileCommandHandler.name);

  constructor(
    @Inject(STORAGE_WRITE_REPOSITORY_TOKEN)
    private readonly storageWriteRepository: StorageWriteRepository,
    private readonly storageProviderFactory: StorageProviderFactoryService,
  ) {}

  /**
   * Executes the storage delete file command
   *
   * @param command - The command to execute
   * @returns True if the file was deleted successfully
   */
  async execute(command: StorageDeleteFileCommand): Promise<boolean> {
    this.logger.log(
      `Executing storage delete file command: ${command.id.value}`,
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

    // 03: Delete file from storage provider
    await provider.delete(storage.path.value);

    // 04: Delete the storage entity from database
    await this.storageWriteRepository.delete(storage.id.value);

    // 05: Return success
    return true;
  }
}
