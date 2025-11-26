import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantDatabaseAlreadyExistsException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-already-exists/tenant-database-already-exists.exception';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantDatabaseNotExsistsService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(
    AssertTenantDatabaseNotExsistsService.name,
  );

  constructor(
    @Inject(TENANT_DATABASE_WRITE_REPOSITORY_TOKEN)
    private readonly tenantDatabaseWriteRepository: TenantDatabaseWriteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Asserting tenant database not exists by id: ${id}`);

    // 01: Find the tenant database aggregate by id
    const existingTenantDatabaseAggregate =
      await this.tenantDatabaseWriteRepository.findById(id);

    // 02: If the tenant database aggregate exists, throw an error
    if (existingTenantDatabaseAggregate) {
      this.logger.error(`Tenant database with id ${id} already exists`);
      throw new TenantDatabaseAlreadyExistsException(id);
    }
  }
}
