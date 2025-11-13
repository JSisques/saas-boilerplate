import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { Injectable, Logger } from '@nestjs/common';
import { StorageProviderEnum } from '@prisma/client';
import { StoragePrismaDto } from '../dtos/storage-prisma.dto';

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
  toDomainEntity(storageData: StoragePrismaDto): StorageAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${storageData.id}`,
    );

    return this.storageAggregateFactory.fromPrimitives({
      id: storageData.id,
      fileName: storageData.fileName,
      fileSize: storageData.fileSize,
      mimeType: storageData.mimeType,
      provider: storageData.provider,
      url: storageData.url,
      path: storageData.path,
    });
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
    };
  }
}
