import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageViewModelFindByIdQuery } from './storage-view-model-find-by-id.query';

@QueryHandler(StorageViewModelFindByIdQuery)
export class StorageViewModelFindByIdQueryHandler
  implements IQueryHandler<StorageViewModelFindByIdQuery>
{
  private readonly logger = new Logger(
    StorageViewModelFindByIdQueryHandler.name,
  );

  constructor(
    private readonly assertStorageViewModelExsistsService: AssertStorageViewModelExsistsService,
  ) {}

  /**
   * Executes the StorageViewModelFindByIdQuery query.
   *
   * @param query - The StorageViewModelFindByIdQuery query to execute.
   * @returns The StorageViewModel if found, null otherwise.
   */
  async execute(
    query: StorageViewModelFindByIdQuery,
  ): Promise<StorageViewModel> {
    this.logger.log(
      `Executing storage view model find by id query: ${query.id.value}`,
    );

    return this.assertStorageViewModelExsistsService.execute(query.id.value);
  }
}
