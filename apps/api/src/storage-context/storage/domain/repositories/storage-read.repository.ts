import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';

export const STORAGE_READ_REPOSITORY_TOKEN = Symbol('StorageReadRepository');

export interface StorageReadRepository {
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<StorageViewModel>>;
  findById(id: string): Promise<StorageViewModel | null>;
  save(storageViewModel: StorageViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
