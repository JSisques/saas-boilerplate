import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageFindByCriteriaQuery } from './storage-find-by-criteria.query';

@QueryHandler(StorageFindByCriteriaQuery)
export class StorageFindByCriteriaQueryHandler
  implements IQueryHandler<StorageFindByCriteriaQuery>
{
  private readonly logger = new Logger(StorageFindByCriteriaQueryHandler.name);

  constructor(
    @Inject(STORAGE_READ_REPOSITORY_TOKEN)
    private readonly storageReadRepository: StorageReadRepository,
  ) {}

  async execute(
    query: StorageFindByCriteriaQuery,
  ): Promise<PaginatedResult<StorageViewModel>> {
    this.logger.log(
      `Executing storage find by criteria query: ${query.criteria.toString()}`,
    );

    return this.storageReadRepository.findByCriteria(query.criteria);
  }
}
