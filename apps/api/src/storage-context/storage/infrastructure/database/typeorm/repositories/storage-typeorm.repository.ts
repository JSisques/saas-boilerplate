import { BaseTypeormTenantRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-tenant/base-typeorm-tenant.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageWriteRepository } from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { StorageTypeormMapper } from '@/storage-context/storage/infrastructure/database/typeorm/mappers/storage-typeorm.mapper';
import { Injectable, Logger, Scope } from '@nestjs/common';

/**
 * TypeORM implementation of the StorageWriteRepository interface. Handles all
 * database interactions related to storage entities using TypeORM, with tenant
 * separation and per-request scope.
 *
 * @remarks
 * - Scoped to each request to get tenant context.
 * - Uses a TypeORM service and entity/mapper pattern.
 * - Extends BaseTypeormTenantRepository which automatically filters all queries by tenantId.
 */
@Injectable({ scope: Scope.REQUEST })
export class StorageTypeormRepository
  extends BaseTypeormTenantRepository<StorageTypeormEntity>
  implements StorageWriteRepository
{
  /**
   * Creates a new instance of StorageTypeormRepository.
   *
   * @param typeormMasterService - The TypeORM master DB service
   * @param tenantContextService - Service to access current tenant context
   * @param storageTypeormMapper - Mapper between domain and entity models
   */
  constructor(
    typeormMasterService: TypeormMasterService,
    tenantContextService: TenantContextService,
    private readonly storageTypeormMapper: StorageTypeormMapper,
  ) {
    super(typeormMasterService, tenantContextService, StorageTypeormEntity);
    this.logger = new Logger(StorageTypeormRepository.name);
  }

  /**
   * Finds a storage aggregate by its unique ID within the current tenant context.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
   *
   * @param id - The Storage ID to search for.
   * @returns A StorageAggregate instance if found, otherwise `null`.
   */
  async findById(id: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by id: ${id}`);

    // Use the base class method which automatically filters by tenantId
    const storageEntity = await super.findOne({
      where: { id } as any,
    });

    return storageEntity
      ? this.storageTypeormMapper.toDomainEntity(storageEntity)
      : null;
  }

  /**
   * Finds a storage aggregate by its path within the current tenant context.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
   *
   * @param path - The path of the storage to search for.
   * @returns A StorageAggregate instance if found, otherwise `null`.
   */
  async findByPath(path: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by path: ${path}`);

    const storageEntity = await super.findOne({
      where: { path } as any,
    });

    return storageEntity
      ? this.storageTypeormMapper.toDomainEntity(storageEntity)
      : null;
  }

  /**
   * Persists the given StorageAggregate to the database.
   * If the storage entity is new, it will be inserted;
   * otherwise, existing data will be updated.
   * TenantId is automatically set by BaseTypeormTenantRepository.
   *
   * @param storage - The storage aggregate domain object to be saved.
   * @returns The saved StorageAggregate instance (as persisted to the DB).
   */
  async save(storage: StorageAggregate): Promise<StorageAggregate> {
    this.logger.log(`Saving storage: ${JSON.stringify(storage)}`);

    const storageData = this.storageTypeormMapper.toTypeormEntity(storage);

    const result = await super.saveEntity(storageData);

    return this.storageTypeormMapper.toDomainEntity(result);
  }

  /**
   * Soft deletes a storage aggregate by its ID within the current tenant context.
   * The record is not permanently removed but is marked as deleted.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
   *
   * @param id - The Storage ID to delete.
   * @returns `true` if the operation was attempted (softDelete does not throw if
   *          not found); always returns true for successful request.
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting storage by id: ${id}`);

    await super.softDelete(id);

    return true;
  }
}
