/**
 * Data Transfer Object for uploading a file via command layer.
 *
 * @interface IStorageUploadFileCommandProps
 * @property {Buffer} buffer - The buffer of the file to upload.
 * @property {string} fileName - The name of the file to upload.
 * @property {string} mimetype - The mime type of the file to upload.
 * @property {number} size - The size of the file to upload.
 */
export interface IStorageUploadFileCommandProps {
  buffer: Buffer;
  fileName: string;
  mimetype: string;
  size: number;
}
