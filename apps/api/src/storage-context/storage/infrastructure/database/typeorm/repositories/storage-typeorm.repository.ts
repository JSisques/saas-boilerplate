import { BaseTypeormTenantRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-tenant/base-typeorm-tenant.repository';
import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageWriteRepository } from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { StorageTypeormMapper } from '@/storage-context/storage/infrastructure/database/typeorm/mappers/storage-typeorm.mapper';
import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class StorageTypeormRepository
  extends BaseTypeormTenantRepository
  implements StorageWriteRepository
{
  constructor(
    typeormTenantService: TypeormTenantService,
    tenantContextService: TenantContextService,
    private readonly storageTypeormMapper: StorageTypeormMapper,
  ) {
    super(typeormTenantService, tenantContextService);
    this.logger = new Logger(StorageTypeormRepository.name);
  }

  /**
   * Finds a storage by their id
   *
   * @param id - The id of the storage to find
   * @returns The storage if found, null otherwise
   */
  async findById(id: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by id: ${id}`);

    const dataSource = await this.getTenantDataSource();
    const repository = dataSource.getRepository(StorageTypeormEntity);

    const storageEntity = await repository.findOne({
      where: { id },
    });

    return storageEntity
      ? this.storageTypeormMapper.toDomainEntity(storageEntity)
      : null;
  }

  /**
   * Finds a storage by their path
   *
   * @param path - The path of the storage to find
   * @returns The storage if found, null otherwise
   */
  async findByPath(path: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by path: ${path}`);

    const dataSource = await this.getTenantDataSource();
    const repository = dataSource.getRepository(StorageTypeormEntity);

    const storageEntity = await repository.findOne({
      where: { path },
    });

    return storageEntity
      ? this.storageTypeormMapper.toDomainEntity(storageEntity)
      : null;
  }

  /**
   * Saves a storage
   *
   * @param storage - The storage to save
   * @returns The saved storage
   */
  async save(storage: StorageAggregate): Promise<StorageAggregate> {
    this.logger.log(`Saving storage: ${JSON.stringify(storage)}`);

    const dataSource = await this.getTenantDataSource();
    const repository = dataSource.getRepository(StorageTypeormEntity);

    const storageData = this.storageTypeormMapper.toTypeormEntity(storage);

    // Use upsert to handle both create and update
    const result = await repository.save(storageData);

    return this.storageTypeormMapper.toDomainEntity(result);
  }

  /**
   * Deletes a storage
   *
   * @param id - The id of the storage to delete
   * @returns True if the storage was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting storage by id: ${id}`);

    const dataSource = await this.getTenantDataSource();
    const repository = dataSource.getRepository(StorageTypeormEntity);

    await repository.softDelete(id);

    return true;
  }
}
