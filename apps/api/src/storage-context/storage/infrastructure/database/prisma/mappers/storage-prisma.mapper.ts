import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StoragePrismaDto } from '@/storage-context/storage/infrastructure/database/prisma/dtos/storage-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Storage as PrismaStorage } from '../../../../../../../prisma/tenant/client';

@Injectable()
export class StoragePrismaMapper {
  private readonly logger = new Logger(StoragePrismaMapper.name);

  constructor(
    private readonly storageAggregateFactory: StorageAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a storage aggregate
   *
   * @param storageData - The Prisma data to convert
   * @returns The storage aggregate
   */
  toDomainEntity(storageData: PrismaStorage): StorageAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${storageData.id}`,
    );

    // Convert Prisma enum to domain enum
    const domainProvider = this.convertProviderEnum(storageData.provider);

    return this.storageAggregateFactory.fromPrimitives({
      id: storageData.id,
      fileName: storageData.fileName,
      fileSize: storageData.fileSize,
      mimeType: storageData.mimeType,
      provider: domainProvider,
      url: storageData.url,
      path: storageData.path,
      createdAt: storageData.createdAt,
      updatedAt: storageData.updatedAt,
    });
  }

  /**
   * Converts Prisma StorageProviderEnum to domain StorageProviderEnum
   *
   * @param prismaProvider - The Prisma enum value
   * @returns The domain enum value
   */
  private convertProviderEnum(prismaProvider: string): StorageProviderEnum {
    switch (prismaProvider) {
      case 'S3':
        return StorageProviderEnum.S3;
      case 'SUPABASE':
        return StorageProviderEnum.SUPABASE;
      case 'SERVER_ROUTE':
        return StorageProviderEnum.SERVER_ROUTE;
      default:
        throw new Error(`Unknown storage provider: ${prismaProvider}`);
    }
  }

  /**
   * Converts a storage aggregate to a Prisma data
   *
   * @param storage - The storage aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(storage: StorageAggregate): StoragePrismaDto {
    this.logger.log(
      `Converting domain entity with id ${storage.id.value} to Prisma data`,
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
