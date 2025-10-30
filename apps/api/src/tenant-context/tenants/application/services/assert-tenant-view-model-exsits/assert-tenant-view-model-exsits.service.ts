import { IBaseService } from '@/shared/application/services/base-service.interface';
import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantViewModelExsistsService
  implements IBaseService<string, TenantViewModel>
{
  private readonly logger = new Logger(
    AssertTenantViewModelExsistsService.name,
  );

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
  ) {}

  /**
   * Asserts that a tenant view model exists by id.
   *
   * @param id - The id of the tenant view model to assert.
   * @returns The tenant view model.
   * @throws TenantNotFoundException if the tenant view model does not exist.
   */
  async execute(id: string): Promise<TenantViewModel> {
    this.logger.log(`Asserting tenant view model exists by id: ${id}`);

    // 01: Find the tenant by id
    const existingTenantViewModel =
      await this.tenantReadRepository.findById(id);

    // 02: If the tenant view model does not exist, throw an error
    if (!existingTenantViewModel) {
      this.logger.error(`Tenant view model not found by id: ${id}`);
      throw new TenantNotFoundException(id);
    }

    return existingTenantViewModel;
  }
}
