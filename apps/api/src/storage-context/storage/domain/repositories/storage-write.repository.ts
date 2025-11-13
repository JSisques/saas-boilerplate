import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';

export const STORAGE_WRITE_REPOSITORY_TOKEN = Symbol('StorageWriteRepository');

export interface StorageWriteRepository {
  findById(id: string): Promise<StorageAggregate | null>;
  findByPath(path: string): Promise<StorageAggregate | null>;
  save(storage: StorageAggregate): Promise<StorageAggregate>;
  delete(id: string): Promise<boolean>;
}
