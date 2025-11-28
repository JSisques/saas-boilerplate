import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';

/**
 * Storage update view model Data Transfer Object.
 *
 * Allows partial updating of a storage entity, excluding the storage's immutable identifier (`id`).
 * @type IStorageUpdateViewModelDto
 * @extends Partial<Omit<IStorageCreateViewModelDto, 'id'>>
 */
export type IStorageUpdateViewModelDto = Partial<
  Omit<IStorageCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
>;
