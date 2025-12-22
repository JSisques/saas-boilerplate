import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseWriteRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabaseTypeormEntity } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/entities/tenant-database-typeorm.entity';
import { TenantDatabaseTypeormMapper } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/mappers/tenant-database-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantDatabaseTypeormRepository
  extends BaseTypeormMasterRepository<TenantDatabaseTypeormEntity>
  implements TenantDatabaseWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly tenantDatabaseTypeormMapper: TenantDatabaseTypeormMapper,
  ) {
    super(typeormMasterService, TenantDatabaseTypeormEntity);
    this.logger = new Logger(TenantDatabaseTypeormRepository.name);
  }

  /**
   * Finds a tenant database by their id
   *
   * @param id - The id of the tenant database to find
   * @returns The tenant database if found, null otherwise
   */
  async findById(id: string): Promise<TenantDatabaseAggregate | null> {
    this.logger.log(`Finding tenant database by id: ${id}`);
    const tenantDatabaseEntity = await this.repository.findOne({
      where: { id },
    });

    return tenantDatabaseEntity
      ? this.tenantDatabaseTypeormMapper.toDomainEntity(tenantDatabaseEntity)
      : null;
  }

  /**
   * Finds a tenant database by their tenant id
   *
   * @param tenantId - The id of the tenant to find tenant database by
   * @returns The tenant database if found, null otherwise
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<TenantDatabaseAggregate | null> {
    this.logger.log(`Finding tenant database by tenant id: ${tenantId}`);
    const tenantDatabaseEntity = await this.repository.findOne({
      where: { tenantId },
    });

    return tenantDatabaseEntity
      ? this.tenantDatabaseTypeormMapper.toDomainEntity(tenantDatabaseEntity)
      : null;
  }

  /**
   * Saves a tenant database
   *
   * @param tenantDatabase - The tenant database to save
   * @returns The saved tenant database
   */
  async save(
    tenantDatabase: TenantDatabaseAggregate,
  ): Promise<TenantDatabaseAggregate> {
    this.logger.log(`Saving tenant database: ${tenantDatabase.id.value}`);
    const tenantDatabaseEntity =
      this.tenantDatabaseTypeormMapper.toTypeormEntity(tenantDatabase);

    const savedEntity = await this.repository.save(tenantDatabaseEntity);

    return this.tenantDatabaseTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a tenant database (soft delete)
   *
   * @param id - The id of the tenant database to delete
   * @returns True if the tenant database was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting tenant database by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
