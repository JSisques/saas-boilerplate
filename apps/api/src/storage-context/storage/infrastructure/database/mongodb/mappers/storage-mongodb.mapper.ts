import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageMongoDbDto } from '@/storage-context/storage/infrastructure/database/mongodb/dtos/storage-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageMongoDBMapper {
  private readonly logger = new Logger(StorageMongoDBMapper.name);

  constructor(
    private readonly storageViewModelFactory: StorageViewModelFactory,
  ) {}

  /**
   * Converts a MongoDB document to a storage view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The storage view model
   */
  toViewModel(doc: StorageMongoDbDto): StorageViewModel {
    this.logger.log(
      `Converting MongoDB document to storage view model with id ${doc.id}`,
    );

    return this.storageViewModelFactory.create({
      id: doc.id,
      tenantId: doc.tenantId,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      provider: doc.provider,
      url: doc.url,
      path: doc.path,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a storage view model to a MongoDB document
   *
   * @param storageViewModel - The storage view model to convert
   * @returns The MongoDB document
   */
  toMongoData(storageViewModel: StorageViewModel): StorageMongoDbDto {
    this.logger.log(
      `Converting storage view model with id ${storageViewModel.id} to MongoDB document`,
    );

    return {
      id: storageViewModel.id,
      tenantId: storageViewModel.tenantId,
      fileName: storageViewModel.fileName,
      fileSize: storageViewModel.fileSize,
      mimeType: storageViewModel.mimeType,
      provider: storageViewModel.provider,
      url: storageViewModel.url,
      path: storageViewModel.path,
      createdAt: storageViewModel.createdAt,
      updatedAt: storageViewModel.updatedAt,
    };
  }
}
