import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { SupabaseDeleteFailedException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-delete-failed.exception';
import { SupabaseDownloadFailedException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-download-failed.exception';
import { SupabaseFileNotFoundException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-file-not-found.exception';
import { SupabaseUploadFailedException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-upload-failed.exception';
import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageProviderService implements IStorageProvider {
  private readonly logger = new Logger(SupabaseStorageProviderService.name);
  private supabaseClient: SupabaseClient | null = null;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'files';
  }

  /**
   * Gets the Supabase client
   * @returns The Supabase client
   */
  private getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          'Supabase configuration is missing. SUPABASE_URL and SUPABASE_KEY are required.',
        );
      }

      this.supabaseClient = createClient(supabaseUrl, supabaseKey);
    }

    return this.supabaseClient;
  }

  /**
   * Uploads a file to the Supabase storage provider
   * @param file - The file to upload
   * @param path - The path where the file should be stored
   * @param mimeType - The mime type of the file
   * @returns The URL of the uploaded file
   */
  async upload(file: Buffer, path: string, mimeType: string): Promise<string> {
    this.logger.log(`Uploading file to Supabase: ${path}`);

    const { error } = await this.getClient()
      .storage.from(this.bucketName)
      .upload(path, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading to Supabase: ${error.message}`);
      throw new SupabaseUploadFailedException(path);
    }

    return await this.getUrl(path);
  }

  /**
   * Extracts the relative path from a Supabase URL if it's a full URL
   * @param pathOrUrl - The path or URL of the file
   * @returns The relative path
   */
  private extractRelativePath(pathOrUrl: string): string {
    // If it's already a relative path, return it
    if (!pathOrUrl.includes('http')) {
      return pathOrUrl;
    }

    // Extract path from Supabase URL
    // Example: https://xxx.supabase.co/storage/v1/object/public/bucket/file.jpg
    // Should extract: file.jpg
    try {
      const url = new URL(pathOrUrl);
      const pathParts = url.pathname.split('/');
      // Find the bucket name and get everything after it
      const bucketIndex = pathParts.findIndex(
        (part) => part === this.bucketName,
      );
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return decodeURIComponent(pathParts.slice(bucketIndex + 1).join('/'));
      }
      // Fallback: try to extract from the last part
      const lastPart = pathParts[pathParts.length - 1];
      return lastPart ? decodeURIComponent(lastPart) : pathOrUrl;
    } catch {
      // If URL parsing fails, return as is (might be a relative path)
      return pathOrUrl;
    }
  }

  /**
   * Downloads a file from the Supabase storage provider
   * @param path - The path of the file to download (can be URL or relative path)
   * @returns The file buffer
   */
  async download(path: string): Promise<Buffer> {
    // Extract relative path from URL if needed
    const relativePath = this.extractRelativePath(path);
    this.logger.log(
      `Downloading file from Supabase: ${relativePath} (original: ${path})`,
    );

    const { data, error } = await this.getClient()
      .storage.from(this.bucketName)
      .download(relativePath);

    if (error) {
      this.logger.error(
        `Error downloading from Supabase: ${JSON.stringify(error)}`,
      );
      throw new SupabaseDownloadFailedException(relativePath);
    }

    if (!data) {
      throw new SupabaseFileNotFoundException(relativePath);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Deletes a file from the Supabase storage provider
   * @param path - The path of the file to delete
   * @returns True if the file was deleted successfully
   */
  async delete(path: string): Promise<boolean> {
    // Extract relative path from URL if needed
    const relativePath = this.extractRelativePath(path);
    this.logger.log(
      `Deleting file from Supabase: ${relativePath} (original: ${path})`,
    );

    const { error } = await this.getClient()
      .storage.from(this.bucketName)
      .remove([relativePath]);

    if (error) {
      this.logger.error(`Error deleting from Supabase: ${error.message}`);
      throw new SupabaseDeleteFailedException(relativePath);
    }

    return true;
  }

  /**
   * Gets the URL of a file without downloading it
   * @param path - The path of the file
   * @returns The URL of the file
   */
  async getUrl(path: string): Promise<string> {
    const { data } = this.getClient()
      .storage.from(this.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Gets the type of the Supabase storage provider
   * @returns The type of the Supabase storage provider
   */
  getProviderType(): StorageProviderEnum {
    return StorageProviderEnum.SUPABASE;
  }
}
