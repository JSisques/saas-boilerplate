import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { StorageUploadFileCommand } from './storage-upload-file.command';

@CommandHandler(StorageUploadFileCommand)
export class StorageUploadFileCommandHandler
  implements ICommandHandler<StorageUploadFileCommand>
{
  private readonly logger = new Logger(StorageUploadFileCommandHandler.name);

  constructor(
    @Inject(STORAGE_WRITE_REPOSITORY_TOKEN)
    private readonly storageWriteRepository: StorageWriteRepository,
    private readonly storageAggregateFactory: StorageAggregateFactory,
    private readonly storageProviderFactory: StorageProviderFactoryService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Executes the storage upload file command
   *
   * @param command - The command to execute
   * @returns The created storage id
   */
  async execute(command: StorageUploadFileCommand): Promise<string> {
    this.logger.log(
      `Executing storage upload file command: ${command.fileName.value}`,
    );

    // 01: Get the storage provider
    const provider = this.storageProviderFactory.getDefaultProvider();
    const providerType = this.storageProviderFactory.getProviderType(provider);

    // 02: Use fileName as the relative path for storage
    const relativePath = command.fileName.value;

    // 03: Upload file to storage provider
    const url = await provider.upload(
      command.buffer,
      relativePath,
      command.mimetype.value,
    );

    // 04: Create the storage entity
    const storage = this.storageAggregateFactory.create({
      id: new StorageUuidValueObject(),
      fileName: command.fileName,
      fileSize: command.size,
      mimeType: command.mimetype,
      provider: new StorageProviderValueObject(providerType),
      url: new StorageUrlValueObject(url),
      path: new StoragePathValueObject(relativePath),
    });

    // 04: Save the storage entity
    await this.storageWriteRepository.save(storage);

    // 05: Mark as uploaded and publish event
    storage.markAsUploaded();

    // 06: Publish all events
    await this.eventBus.publishAll(storage.getUncommittedEvents());
    await storage.commit();

    // 07: Return the storage id
    return storage.id.value;
  }
}
