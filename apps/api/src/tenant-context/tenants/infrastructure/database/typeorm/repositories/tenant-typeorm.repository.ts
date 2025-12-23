import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantWriteRepository } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { TenantTypeormEntity } from '@/tenant-context/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { TenantTypeormMapper } from '@/tenant-context/tenants/infrastructure/database/typeorm/mappers/tenant-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantTypeormRepository
  extends BaseTypeormMasterRepository<TenantTypeormEntity>
  implements TenantWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly tenantTypeormMapper: TenantTypeormMapper,
  ) {
    super(typeormMasterService, TenantTypeormEntity);
    this.logger = new Logger(TenantTypeormRepository.name);
  }

  /**
   * Finds a tenant by their id
   *
   * @param id - The id of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findById(id: string): Promise<TenantAggregate | null> {
    this.logger.log(`Finding tenant by id: ${id}`);
    const tenantEntity = await this.repository.findOne({
      where: { id },
    });

    return tenantEntity
      ? this.tenantTypeormMapper.toDomainEntity(tenantEntity)
      : null;
  }

  /**
   * Finds a tenant by their slug
   *
   * @param slug - The slug of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findBySlug(slug: string): Promise<TenantAggregate | null> {
    this.logger.log(`Finding tenant by slug: ${slug}`);
    const tenantEntity = await this.repository.findOne({
      where: { slug },
    });

    return tenantEntity
      ? this.tenantTypeormMapper.toDomainEntity(tenantEntity)
      : null;
  }

  /**
   * Saves a tenant
   *
   * @param tenant - The tenant to save
   * @returns The saved tenant
   */
  async save(tenant: TenantAggregate): Promise<TenantAggregate> {
    this.logger.log(`Saving tenant: ${tenant.id.value}`);
    const tenantEntity = this.tenantTypeormMapper.toTypeormEntity(tenant);

    const savedEntity = await this.repository.save(tenantEntity);

    return this.tenantTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a tenant (soft delete)
   *
   * @param id - The id of the tenant to delete
   * @returns True if the tenant was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting tenant by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
