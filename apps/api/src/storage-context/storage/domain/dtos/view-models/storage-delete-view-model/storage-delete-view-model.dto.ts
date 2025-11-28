import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';

/**
 * Storage delete view model Data Transfer Object.
 *
 * Allows deleting a storage entity by specifying only the storage's immutable identifier (`id`).
 * @type IStorageDeleteViewModelDto
 * @property {string} id - The immutable identifier of the storage to delete.
 */
export type IStorageDeleteViewModelDto = Pick<IStorageCreateViewModelDto, 'id'>;
