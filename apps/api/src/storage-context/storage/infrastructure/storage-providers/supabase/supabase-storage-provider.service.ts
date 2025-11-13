import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProviderEnum } from '@prisma/client';
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

    const { data, error } = await this.getClient()
      .storage.from(this.bucketName)
      .upload(path, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading to Supabase: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return await this.getUrl(path);
  }

  /**
   * Downloads a file from the Supabase storage provider
   * @param path - The path of the file to download
   * @returns The file buffer
   */
  async download(path: string): Promise<Buffer> {
    this.logger.log(`Downloading file from Supabase: ${path}`);

    const { data, error } = await this.getClient()
      .storage.from(this.bucketName)
      .download(path);

    if (error) {
      this.logger.error(`Error downloading from Supabase: ${error.message}`);
      throw new Error(`Failed to download file: ${error.message}`);
    }

    if (!data) {
      throw new Error('File not found');
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
    this.logger.log(`Deleting file from Supabase: ${path}`);

    const { error } = await this.getClient()
      .storage.from(this.bucketName)
      .remove([path]);

    if (error) {
      this.logger.error(`Error deleting from Supabase: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
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
