import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProviderEnum } from '@prisma/client';

@Injectable()
export class S3StorageProviderService implements IStorageProvider {
  private readonly logger = new Logger(S3StorageProviderService.name);
  private s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region =
      this.configService.get<string>('AWS_S3_REGION') || 'us-east-1';
    this.bucketName =
      this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
  }

  /**
   * Gets the S3 client
   * @returns The S3 client
   */
  private getClient(): S3Client {
    if (!this.s3Client) {
      const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
      const secretAccessKey = this.configService.get<string>(
        'AWS_SECRET_ACCESS_KEY',
      );

      if (!accessKeyId || !secretAccessKey || !this.bucketName) {
        throw new Error(
          'AWS S3 configuration is missing. AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME are required.',
        );
      }

      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }

    return this.s3Client;
  }

  /**
   * Uploads a file to the S3 storage provider
   * @param file - The file to upload
   * @param path - The path where the file should be stored
   * @param mimeType - The mime type of the file
   * @returns The URL of the uploaded file
   */
  async upload(file: Buffer, path: string, mimeType: string): Promise<string> {
    this.logger.log(`Uploading file to S3: ${path}`);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: file,
      ContentType: mimeType,
    });

    await this.getClient().send(command);

    return await this.getUrl(path);
  }

  /**
   * Downloads a file from the S3 storage provider
   * @param path - The path of the file to download
   * @returns The file buffer
   */
  async download(path: string): Promise<Buffer> {
    this.logger.log(`Downloading file from S3: ${path}`);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    const response = await this.getClient().send(command);
    const chunks: Uint8Array[] = [];

    if (response.Body) {
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
    }

    return Buffer.concat(chunks);
  }

  /**
   * Deletes a file from the S3 storage provider
   * @param path - The path of the file to delete
   * @returns True if the file was deleted successfully
   */
  async delete(path: string): Promise<boolean> {
    this.logger.log(`Deleting file from S3: ${path}`);

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    await this.getClient().send(command);
    return true;
  }

  /**
   * Gets the URL of a file without downloading it
   * @param path - The path of the file
   * @returns The URL of the file
   */
  async getUrl(path: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    // Generate a presigned URL that expires in 1 hour
    const signedUrl = await getSignedUrl(this.getClient(), command, {
      expiresIn: 3600,
    });

    return signedUrl;
  }

  /**
   * Gets the type of the S3 storage provider
   * @returns The type of the S3 storage provider
   */
  getProviderType(): StorageProviderEnum {
    return StorageProviderEnum.S3;
  }
}
