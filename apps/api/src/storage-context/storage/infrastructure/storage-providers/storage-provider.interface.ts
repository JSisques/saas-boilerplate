import { StorageProviderEnum } from '@prisma/client';

/**
 * Interface for storage providers
 * All storage providers must implement this interface
 */
export interface IStorageProvider {
  /**
   * Uploads a file to the storage provider
   * @param file - The file to upload
   * @param path - The path where the file should be stored
   * @returns The URL of the uploaded file
   */
  upload(file: Buffer, path: string, mimeType: string): Promise<string>;

  /**
   * Downloads a file from the storage provider
   * @param path - The path of the file to download
   * @returns The file buffer
   */
  download(path: string): Promise<Buffer>;

  /**
   * Deletes a file from the storage provider
   * @param path - The path of the file to delete
   * @returns True if the file was deleted successfully
   */
  delete(path: string): Promise<boolean>;

  /**
   * Gets the URL of a file without downloading it
   * @param path - The path of the file
   * @returns The URL of the file
   */
  getUrl(path: string): Promise<string>;

  /**
   * Gets the type of the storage provider
   * @returns The type of the storage provider
   */
  getProviderType(): StorageProviderEnum;
}
