import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantDatabaseAlreadyExistsException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-already-exists/tenant-database-already-exists.exception';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantDatabaseViewModelExsistsService
  implements IBaseService<string, TenantDatabaseViewModel>
{
  private readonly logger = new Logger(
    AssertTenantDatabaseViewModelExsistsService.name,
  );

  constructor(
    @Inject(TENANT_DATABASE_READ_REPOSITORY_TOKEN)
    private readonly tenantDatabaseReadRepository: TenantDatabaseReadRepository,
  ) {}

  /**
   * Asserts that a tenant database view model exists by id.
   *
   * @param id - The id of the tenant database view model to assert.
   * @returns The tenant database view model.
   * @throws TenantDatabaseNotFoundException if the tenant database view model does not exist.
   */
  async execute(id: string): Promise<TenantDatabaseViewModel> {
    this.logger.log(`Asserting tenant database view model exists by id: ${id}`);

    // 01: Find the tenant database by id
    const existingTenantDatabaseViewModel =
      await this.tenantDatabaseReadRepository.findById(id);

    // 02: If the tenant database view model does not exist, throw an error
    if (!existingTenantDatabaseViewModel) {
      this.logger.error(`Tenant database view model not found by id: ${id}`);
      throw new TenantDatabaseAlreadyExistsException(id);
    }

    return existingTenantDatabaseViewModel;
  }
}
