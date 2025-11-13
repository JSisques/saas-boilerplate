/**
 * Data Transfer Object for downloading a file by id via command layer.
 *
 * @interface IStorageDownloadFileCommandDto
 * @property {string} id - The id of the storage to download.
 */
export interface IStorageDownloadFileCommandDto {
  id: string;
}
