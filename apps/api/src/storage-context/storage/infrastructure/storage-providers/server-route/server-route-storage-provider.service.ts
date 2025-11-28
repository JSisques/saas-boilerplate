import { ServerRouteDeleteFailedException } from '@/storage-context/storage/infrastructure/exceptions/server-route/server-route-delete-failed.exception';
import { ServerRouteDownloadFailedException } from '@/storage-context/storage/infrastructure/exceptions/server-route/server-route-download-failed.exception';
import { ServerRouteUploadFailedException } from '@/storage-context/storage/infrastructure/exceptions/server-route/server-route-upload-failed.exception';
import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ServerRouteStorageProviderService implements IStorageProvider {
  private readonly logger = new Logger(ServerRouteStorageProviderService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Gets the base URL of the server route storage provider
   * @returns The base URL of the server route storage provider
   */
  private getBaseUrl(): string {
    const baseUrl = this.configService.get<string>('STORAGE_SERVER_ROUTE_URL');
    if (!baseUrl) {
      throw new Error(
        'Server Route storage configuration is missing. STORAGE_SERVER_ROUTE_URL is required.',
      );
    }
    return baseUrl;
  }

  /**
   * Gets the API key of the server route storage provider
   * @returns The API key of the server route storage provider
   */
  private getApiKey(): string {
    const apiKey = this.configService.get<string>(
      'STORAGE_SERVER_ROUTE_API_KEY',
    );
    if (!apiKey) {
      throw new Error(
        'Server Route storage configuration is missing. STORAGE_SERVER_ROUTE_API_KEY is required.',
      );
    }
    return apiKey;
  }

  /**
   * Uploads a file to the server route storage provider
   * @param file - The file to upload
   * @param path - The path where the file should be stored
   * @param mimeType - The mime type of the file
   * @returns The URL of the uploaded file
   */
  async upload(file: Buffer, path: string, mimeType: string): Promise<string> {
    this.logger.log(`Uploading file to server route: ${path}`);

    const formData = new FormData();
    const blob = new Blob([Buffer.from(file)], { type: mimeType });
    formData.append('file', blob, path);
    formData.append('path', path);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.getBaseUrl()}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }),
      );

      return response.data.url || response.data.path;
    } catch (error: any) {
      this.logger.error(`Error uploading to server route: ${error.message}`);
      throw new ServerRouteUploadFailedException(path);
    }
  }

  /**
   * Downloads a file from the server route storage provider
   * @param path - The path of the file to download
   * @returns The file buffer
   */
  async download(path: string): Promise<Buffer> {
    this.logger.log(`Downloading file from server route: ${path}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.getBaseUrl()}/download/${path}`, {
          headers: {
            Authorization: `Bearer ${this.getApiKey()}`,
          },
          responseType: 'arraybuffer',
        }),
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      this.logger.error(
        `Error downloading from server route: ${error.message}`,
      );
      throw new ServerRouteDownloadFailedException(path);
    }
  }

  /**
   * Deletes a file from the server route storage provider
   * @param path - The path of the file to delete
   * @returns True if the file was deleted successfully
   */
  async delete(path: string): Promise<boolean> {
    this.logger.log(`Deleting file from server route: ${path}`);

    try {
      await firstValueFrom(
        this.httpService.delete(`${this.getBaseUrl()}/delete/${path}`, {
          headers: {
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }),
      );

      return true;
    } catch (error: any) {
      this.logger.error(`Error deleting from server route: ${error.message}`);
      throw new ServerRouteDeleteFailedException(path);
    }
  }

  /**
   * Gets the URL of a file without downloading it
   * @param path - The path of the file
   * @returns The URL of the file
   */
  async getUrl(path: string): Promise<string> {
    return `${this.getBaseUrl()}/files/${path}`;
  }

  /**
   * Gets the type of the server route storage provider
   * @returns The type of the server route storage provider
   */
  getProviderType(): StorageProviderEnum {
    return StorageProviderEnum.SERVER_ROUTE;
  }
}
