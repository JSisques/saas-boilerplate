import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantDatabaseTenantIdIsNotUniqueException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-tenant-id-exists/tenant-database-tenant-id-exists.exception';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantDatabaseTenantIdIsUniqueService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(
    AssertTenantDatabaseTenantIdIsUniqueService.name,
  );

  constructor(
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
  ) {}

  async execute(tenantId: string): Promise<void> {
    this.logger.log(
      `Asserting tenant database tenant id is unique by tenant id: ${tenantId}`,
    );

    // 01: Find the tenant database by tenant id
    const existingTenantDatabaseAggregate =
      await this.tenantDatabaseWriteRepository.findByTenantId(tenantId);

    // 02: If the tenant database tenant id is not unique, throw an error
    if (existingTenantDatabaseAggregate) {
      this.logger.error(`Tenant database tenant id ${tenantId} is not unique`);
      throw new TenantDatabaseTenantIdIsNotUniqueException(tenantId);
    }
  }
}
