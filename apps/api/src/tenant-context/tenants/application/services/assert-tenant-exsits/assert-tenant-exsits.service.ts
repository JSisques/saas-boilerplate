import { IBaseService } from '@/shared/application/services/base-service.interface';
import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantExsistsService
  implements IBaseService<string, TenantAggregate>
{
  private readonly logger = new Logger(AssertTenantExsistsService.name);

  constructor(
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
  ) {}

  async execute(id: string): Promise<TenantAggregate> {
    this.logger.log(`Asserting tenant exists by id: ${id}`);

    // 01: Find the tenant by id
    const existingTenant = await this.tenantWriteRepository.findById(id);

    // 02: If the tenant does not exist, throw an error
    if (!existingTenant) {
      this.logger.error(`Tenant not found by id: ${id}`);
      throw new TenantNotFoundException(id);
    }

    return existingTenant;
  }
}
