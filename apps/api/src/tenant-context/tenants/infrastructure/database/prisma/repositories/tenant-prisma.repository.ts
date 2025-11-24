import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantWriteRepository } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { TenantPrismaMapper } from '@/tenant-context/tenants/infrastructure/database/prisma/mappers/tenant-prisma.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantPrismaRepository
  extends BasePrismaMasterRepository
  implements TenantWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly tenantPrismaMapper: TenantPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(TenantPrismaRepository.name);
  }

  /**
   * Finds a tenant by their id
   *
   * @param id - The id of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findById(id: string): Promise<TenantAggregate | null> {
    const tenantData = await this.prismaMasterService.tenant.findUnique({
      where: { id },
    });

    if (!tenantData) {
      return null;
    }

    return this.tenantPrismaMapper.toDomainEntity(tenantData);
  }

  /**
   * Finds a tenant by their slug
   *
   * @param slug - The slug of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findBySlug(slug: string): Promise<TenantAggregate | null> {
    const tenantData = await this.prismaMasterService.tenant.findUnique({
      where: { slug },
    });

    if (!tenantData) {
      return null;
    }

    return this.tenantPrismaMapper.toDomainEntity(tenantData);
  }

  /**
   * Saves a tenant
   *
   * @param tenant - The tenant to save
   * @returns The saved tenant
   */
  async save(tenant: TenantAggregate): Promise<TenantAggregate> {
    const tenantData = this.tenantPrismaMapper.toPrismaData(tenant);

    const result = await this.prismaMasterService.tenant.upsert({
      where: { id: tenant.id.value },
      update: tenantData,
      create: tenantData,
    });

    return this.tenantPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a tenant
   *
   * @param tenant - The tenant to delete
   * @returns True if the tenant was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting tenant by id: ${id}`);

    await this.prismaMasterService.tenant.delete({
      where: { id },
    });

    return true;
  }
}
