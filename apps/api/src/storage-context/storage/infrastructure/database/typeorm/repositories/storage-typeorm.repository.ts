import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
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
 */
@Injectable({ scope: Scope.REQUEST })
export class StorageTypeormRepository
  extends BaseTypeormMasterRepository<StorageTypeormEntity>
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
    private readonly tenantContextService: TenantContextService,
    private readonly storageTypeormMapper: StorageTypeormMapper,
  ) {
    super(typeormMasterService, StorageTypeormEntity);
    this.logger = new Logger(StorageTypeormRepository.name);
  }

  /**
   * Returns the current tenant ID from the tenant context service.
   *
   * @throws {Error} Throws if tenant ID is not found.
   */
  protected get tenantId(): string {
    return this.tenantContextService.getTenantIdOrThrow();
  }

  /**
   * Finds a storage aggregate by its unique ID within the current tenant context.
   *
   * @param id - The Storage ID to search for.
   * @returns A StorageAggregate instance if found, otherwise `null`.
   */
  async findById(id: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by id: ${id}`);

    const storageEntity = await this.repository.findOne({
      where: { id, tenantId: this.tenantId },
    });

    return storageEntity
      ? this.storageTypeormMapper.toDomainEntity(storageEntity)
      : null;
  }

  /**
   * Finds a storage aggregate by its path within the current tenant context.
   *
   * @param path - The path of the storage to search for.
   * @returns A StorageAggregate instance if found, otherwise `null`.
   */
  async findByPath(path: string): Promise<StorageAggregate | null> {
    this.logger.log(`Finding storage by path: ${path}`);

    const storageEntity = await this.repository.findOne({
      where: { path, tenantId: this.tenantId },
    });

    return storageEntity
      ? this.storageTypeormMapper.toDomainEntity(storageEntity)
      : null;
  }

  /**
   * Persists the given StorageAggregate to the database.
   * If the storage entity is new, it will be inserted;
   * otherwise, existing data will be updated.
   *
   * @param storage - The storage aggregate domain object to be saved.
   * @returns The saved StorageAggregate instance (as persisted to the DB).
   */
  async save(storage: StorageAggregate): Promise<StorageAggregate> {
    this.logger.log(`Saving storage: ${JSON.stringify(storage)}`);

    const storageData = this.storageTypeormMapper.toTypeormEntity(storage);

    // Ensure tenantId is always set
    if (!storageData.tenantId) {
      storageData.tenantId = this.tenantId;
    }

    const result = await this.repository.save(storageData);

    return this.storageTypeormMapper.toDomainEntity(result);
  }

  /**
   * Soft deletes a storage aggregate by its ID within the current tenant context.
   * The record is not permanently removed but is marked as deleted.
   *
   * @param id - The Storage ID to delete.
   * @returns `true` if the operation was attempted (softDelete does not throw if
   *          not found); always returns true for successful request.
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting storage by id: ${id}`);

    await this.repository.softDelete({ id, tenantId: this.tenantId });

    return true;
  }
}
