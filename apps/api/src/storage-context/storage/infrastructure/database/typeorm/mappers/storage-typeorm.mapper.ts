import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StorageTypeormDto } from '@/storage-context/storage/infrastructure/database/typeorm/dtos/storage-typeorm.dto';
import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageTypeormMapper {
  private readonly logger = new Logger(StorageTypeormMapper.name);

  constructor(
    private readonly storageAggregateFactory: StorageAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a storage aggregate
   *
   * @param storageEntity - The TypeORM entity to convert
   * @returns The storage aggregate
   */
  toDomainEntity(storageEntity: StorageTypeormEntity): StorageAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${storageEntity.id}`,
    );

    // Convert TypeORM enum to domain enum
    const domainProvider = this.convertProviderEnum(storageEntity.provider);

    return this.storageAggregateFactory.fromPrimitives({
      id: storageEntity.id,
      fileName: storageEntity.fileName,
      fileSize: Number(storageEntity.fileSize), // Convert bigint to number
      mimeType: storageEntity.mimeType,
      provider: domainProvider,
      url: storageEntity.url,
      path: storageEntity.path,
      createdAt: storageEntity.createdAt,
      updatedAt: storageEntity.updatedAt,
    });
  }

  /**
   * Converts TypeORM StorageProviderEnum to domain StorageProviderEnum
   *
   * @param typeormProvider - The TypeORM enum value
   * @returns The domain enum value
   */
  private convertProviderEnum(
    typeormProvider: StorageProviderEnum,
  ): StorageProviderEnum {
    switch (typeormProvider) {
      case StorageProviderEnum.S3:
        return StorageProviderEnum.S3;
      case StorageProviderEnum.SUPABASE:
        return StorageProviderEnum.SUPABASE;
      case StorageProviderEnum.SERVER_ROUTE:
        return StorageProviderEnum.SERVER_ROUTE;
      default:
        throw new Error(`Unknown storage provider: ${typeormProvider}`);
    }
  }

  /**
   * Converts a storage aggregate to a TypeORM entity
   *
   * @param storage - The storage aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(storage: StorageAggregate): Partial<StorageTypeormEntity> {
    this.logger.log(
      `Converting domain entity with id ${storage.id.value} to TypeORM entity`,
    );

    // Get primitives from aggregate
    const primitives = storage.toPrimitives();

    return {
      id: primitives.id,
      fileName: primitives.fileName,
      fileSize: primitives.fileSize,
      mimeType: primitives.mimeType,
      provider: primitives.provider as StorageProviderEnum,
      url: primitives.url,
      path: primitives.path,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
