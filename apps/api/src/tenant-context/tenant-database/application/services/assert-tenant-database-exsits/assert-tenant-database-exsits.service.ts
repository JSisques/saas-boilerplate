import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantDatabaseNotFoundException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-not-found/tenant-database-not-found.exception';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantDatabaseExsistsService
  implements IBaseService<string, TenantDatabaseAggregate>
{
  private readonly logger = new Logger(AssertTenantDatabaseExsistsService.name);

  constructor(
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
  ) {}

  async execute(id: string): Promise<TenantDatabaseAggregate> {
    this.logger.log(`Asserting tenant database exists by id: ${id}`);

    // 01: Find the tenant database aggregate by id
    const existingTenantDatabaseAggregate =
      await this.tenantDatabaseWriteRepository.findById(id);

    // 02: If the tenant database aggregate does not exist, throw an error
    if (!existingTenantDatabaseAggregate) {
      this.logger.error(`Tenant database not found by id: ${id}`);
      throw new TenantDatabaseNotFoundException(id);
    }

    return existingTenantDatabaseAggregate;
  }
}
