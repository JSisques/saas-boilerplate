/**
 * Data Transfer Object for deleting a prompt by id via command layer.
 *
 * @interface IStorageDeleteFileCommandDto
 * @property {string} id - The id of the storage to delete.
 */
export interface IStorageDeleteFileCommandDto {
  id: string;
}
