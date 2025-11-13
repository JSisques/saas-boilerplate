import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageFindByIdQuery } from './storage-find-by-id.query';

@QueryHandler(StorageFindByIdQuery)
export class StorageFindByIdQueryHandler
  implements IQueryHandler<StorageFindByIdQuery>
{
  constructor(
    @Inject(STORAGE_READ_REPOSITORY_TOKEN)
    private readonly storageReadRepository: StorageReadRepository,
  ) {}

  async execute(query: StorageFindByIdQuery): Promise<StorageViewModel | null> {
    return this.storageReadRepository.findById(query.id.value);
  }
}
