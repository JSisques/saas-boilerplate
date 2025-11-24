import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseWriteRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabasePrismaMapper } from '@/tenant-context/tenant-database/infrastructure/database/prisma/mappers/tenant-database-prisma.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantDatabasePrismaRepository
  extends BasePrismaMasterRepository
  implements TenantDatabaseWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly tenantDatabasePrismaMapper: TenantDatabasePrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(TenantDatabasePrismaRepository.name);
  }

  /**
   * Finds a tenant database by their id
   *
   * @param id - The id of the tenant database to find
   * @returns The tenant database if found, null otherwise
   */
  async findById(id: string): Promise<TenantDatabaseAggregate | null> {
    const tenantDatabaseData =
      await this.prismaMasterService.tenantDatabase.findUnique({
        where: { id },
      });

    if (!tenantDatabaseData) {
      return null;
    }

    return this.tenantDatabasePrismaMapper.toDomainEntity(tenantDatabaseData);
  }

  /**
   * Finds a tenant database by their tenant id
   *
   * @param tenantId - The id of the tenant to find tenant databases by
   * @returns The tenant databases if found, null otherwise
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<TenantDatabaseAggregate[] | null> {
    const tenantDatabasesData =
      await this.prismaMasterService.tenantDatabase.findMany({
        where: { tenantId },
      });

    return tenantDatabasesData.map((tenantDatabaseData) =>
      this.tenantDatabasePrismaMapper.toDomainEntity(tenantDatabaseData),
    );
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
    const tenantDatabaseData =
      this.tenantDatabasePrismaMapper.toPrismaData(tenantDatabase);

    const result = await this.prismaMasterService.tenantDatabase.upsert({
      where: { id: tenantDatabase.id.value },
      update: tenantDatabaseData,
      create: tenantDatabaseData,
    });

    return this.tenantDatabasePrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a tenant database
   *
   * @param tenantDatabase - The tenant database to delete
   * @returns True if the tenant database was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting tenant database by id: ${id}`);

    await this.prismaMasterService.tenantDatabase.delete({
      where: { id },
    });

    return true;
  }
}
