import { BasePrismaTenantRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-tenant/base-prisma-tenant.repository';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant/prisma-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageWriteRepository } from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StoragePrismaMapper } from '@/storage-context/storage/infrastructure/database/prisma/mappers/storage-prisma.mapper';
import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class StoragePrismaRepository
  extends BasePrismaTenantRepository
  implements StorageWriteRepository
{
  constructor(
    prismaTenantService: PrismaTenantService,
    tenantContextService: TenantContextService,
    private readonly storagePrismaMapper: StoragePrismaMapper,
  ) {
    super(prismaTenantService, tenantContextService);
    this.logger = new Logger(StoragePrismaRepository.name);
  }

  /**
   * Finds a storage by their id
   *
   * @param id - The id of the storage to find
   * @returns The storage if found, null otherwise
   */
  async findById(id: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by id: ${id}`);

    const client = await this.getTenantClient();
    const storageData = await client.storage.findUnique({
      where: { id },
    });

    if (!storageData) {
      return null;
    }

    return this.storagePrismaMapper.toDomainEntity(storageData);
  }

  /**
   * Finds a storage by their path
   *
   * @param path - The path of the storage to find
   * @returns The storage if found, null otherwise
   */
  async findByPath(path: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by path: ${path}`);

    const client = await this.getTenantClient();
    const storageData = await client.storage.findFirst({
      where: { path },
    });

    if (!storageData) {
      return null;
    }

    return this.storagePrismaMapper.toDomainEntity(storageData);
  }

  /**
   * Saves a storage
   *
   * @param storage - The storage to save
   * @returns The saved storage
   */
  async save(storage: StorageAggregate): Promise<StorageAggregate> {
    this.logger.log(`Saving storage: ${JSON.stringify(storage)}`);

    const storageData = this.storagePrismaMapper.toPrismaData(storage);

    const client = await this.getTenantClient();
    const result = await client.storage.upsert({
      where: { id: storage.id.value },
      update: storageData,
      create: storageData,
    });

    return this.storagePrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a storage
   *
   * @param id - The id of the storage to delete
   * @returns True if the storage was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting storage by id: ${id}`);

    const client = await this.getTenantClient();
    await client.storage.delete({
      where: { id },
    });

    return true;
  }
}
