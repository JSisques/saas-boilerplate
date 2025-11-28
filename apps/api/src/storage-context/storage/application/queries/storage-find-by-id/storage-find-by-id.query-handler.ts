import { AssertStorageExsistsService } from '@/storage-context/storage/application/services/assert-storage-exsits/assert-storage-exsits.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageFindByIdQuery } from './storage-find-by-id.query';

@QueryHandler(StorageFindByIdQuery)
export class StorageFindByIdQueryHandler
  implements IQueryHandler<StorageFindByIdQuery>
{
  private readonly logger = new Logger(StorageFindByIdQueryHandler.name);

  constructor(
    private readonly assertStorageExsistsService: AssertStorageExsistsService,
  ) {}

  async execute(query: StorageFindByIdQuery): Promise<StorageAggregate> {
    this.logger.log(`Executing storage find by id query: ${query.id.value}`);

    return this.assertStorageExsistsService.execute(query.id.value);
  }
}
