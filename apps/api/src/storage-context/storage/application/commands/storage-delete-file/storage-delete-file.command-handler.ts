import { AssertStorageExsistsService } from '@/storage-context/storage/application/services/assert-storage-exsits/assert-storage-exsits.service';
import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
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
    private readonly assertStorageExsistsService: AssertStorageExsistsService,
    private readonly assertStorageViewModelExsistsService: AssertStorageViewModelExsistsService,
    private readonly eventBus: EventBus,
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

    // 01: Check if the storage exists
    const existingStorage = await this.assertStorageExsistsService.execute(
      command.id.value,
    );

    // 02: Get the storage provider
    const provider = this.storageProviderFactory.getProvider(
      existingStorage.provider.value as any,
    );

    // 03: Delete file from storage provider
    await provider.delete(existingStorage.path.value);

    // 04: Delete the storage entity from database
    await this.storageWriteRepository.delete(existingStorage.id.value);

    // 05: Delete the storage entity
    existingStorage.delete();

    // 06: Mark as deleted and publish event
    await this.eventBus.publishAll(existingStorage.getUncommittedEvents());
    await existingStorage.commit();

    // 07: Return success
    return true;
  }
}
