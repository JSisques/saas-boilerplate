import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { S3StorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/s3/s3-storage-provider.service';
import { ServerRouteStorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/server-route/server-route-storage-provider.service';
import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { SupabaseStorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/supabase/supabase-storage-provider.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageProviderFactoryService {
  private readonly logger = new Logger(StorageProviderFactoryService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Provider: S3StorageProviderService,
    private readonly supabaseProvider: SupabaseStorageProviderService,
    private readonly serverRouteProvider: ServerRouteStorageProviderService,
  ) {}

  /**
   * Gets the storage provider based on the provider type
   * @param provider - The storage provider type
   * @returns The storage provider instance
   */
  getProvider(provider: StorageProviderEnum): IStorageProvider {
    this.logger.log(`Getting provider: ${provider}`);

    switch (provider) {
      case StorageProviderEnum.S3:
        return this.s3Provider;
      case StorageProviderEnum.SUPABASE:
        return this.supabaseProvider;
      case StorageProviderEnum.SERVER_ROUTE:
        return this.serverRouteProvider;
    }
  }

  /**
   * Gets the default storage provider from environment configuration
   * @returns The default storage provider instance
   */
  getDefaultProvider(): IStorageProvider {
    this.logger.log('Getting default provider');

    const defaultProvider =
      (this.configService
        .get<StorageProviderEnum>('STORAGE_PROVIDER')
        .toUpperCase() as StorageProviderEnum) || StorageProviderEnum.S3;

    this.logger.log(`Default provider: ${defaultProvider}`);
    return this.getProvider(defaultProvider);
  }

  /**
   * Gets the type of the storage provider
   * @param provider - The storage provider instance
   * @returns The type of the storage provider
   */
  getProviderType(provider: IStorageProvider): StorageProviderEnum {
    return provider.getProviderType() as StorageProviderEnum;
  }
}
