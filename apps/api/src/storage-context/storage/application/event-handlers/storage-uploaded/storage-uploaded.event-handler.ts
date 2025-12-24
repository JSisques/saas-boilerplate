import { StorageFileUploadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-uploaded/storage-file-uploaded.event';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Handles the event triggered when a storage file is uploaded.
 *
 * This event handler is responsible for:
 * - Retrieving the tenant context.
 * - Building a view model from the uploaded file event.
 * - Saving the new view model to the storage read repository.
 *
 * @remarks
 * This ensures that the storage read model stays up to date with uploaded files.
 *
 * @see StorageFileUploadedEvent
 */
@EventsHandler(StorageFileUploadedEvent)
export class StorageUploadedEventHandler
  implements IEventHandler<StorageFileUploadedEvent>
{
  /** Logger instance for the handler. */
  private readonly logger = new Logger(StorageUploadedEventHandler.name);

  /**
   * Creates a new StorageUploadedEventHandler.
   *
   * @param storageReadRepository - The repository used to save the storage view model.
   * @param storageViewModelFactory - Factory to create the storage view model.
   * @param tenantContextService - Service to retrieve tenant-related context.
   */
  constructor(
    @Inject(STORAGE_READ_REPOSITORY_TOKEN)
    private readonly storageReadRepository: StorageReadRepository,
    private readonly storageViewModelFactory: StorageViewModelFactory,
    private readonly tenantContextService: TenantContextService,
  ) {}

  /**
   * Handles the StorageFileUploadedEvent.
   * Logs the event, retrieves the current tenant, creates a storage view model from event data,
   * and persists it to the storage read repository.
   *
   * @param event - The event object containing information about the uploaded file.
   */
  async handle(event: StorageFileUploadedEvent): Promise<void> {
    this.logger.log(`Handling storage uploaded event: ${event.aggregateId}`);

    // 01: Get tenant ID from context
    const tenantId = this.tenantContextService.getTenantIdOrThrow();

    // 02: Create view model from event data
    const viewModel = this.storageViewModelFactory.create({
      id: event.data.id,
      tenantId,
      fileName: event.data.fileName,
      fileSize: event.data.fileSize,
      mimeType: event.data.mimeType,
      provider: event.data.provider,
      url: event.data.url,
      path: event.data.path,
      createdAt: event.ocurredAt,
      updatedAt: event.ocurredAt,
    });

    // 03: Save to read repository
    await this.storageReadRepository.save(viewModel);
  }
}
