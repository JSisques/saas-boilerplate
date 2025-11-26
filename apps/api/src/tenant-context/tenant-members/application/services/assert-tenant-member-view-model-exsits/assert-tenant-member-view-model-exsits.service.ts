import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import {
  TENANT_MEMBER_READ_REPOSITORY_TOKEN,
  TenantMemberReadRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantMemberViewModelExsistsService
  implements IBaseService<string, TenantMemberViewModel>
{
  private readonly logger = new Logger(
    AssertTenantMemberViewModelExsistsService.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_READ_REPOSITORY_TOKEN)
    private readonly tenantMemberReadRepository: TenantMemberReadRepository,
  ) {}

  /**
   * Asserts that a tenant member view model exists by id.
   *
   * @param id - The id of the tenant member view model to assert.
   * @returns The tenant member view model.
   * @throws TenantMemberNotFoundException if the tenant member view model does not exist.
   */
  async execute(id: string): Promise<TenantMemberViewModel> {
    this.logger.log(`Asserting tenant member view model exists by id: ${id}`);

    // 01: Find the tenant member by id
    const existingTenantMemberViewModel =
      await this.tenantMemberReadRepository.findById(id);

    // 02: If the tenant member view model does not exist, throw an error
    if (!existingTenantMemberViewModel) {
      this.logger.error(`Tenant member view model not found by id: ${id}`);
      throw new TenantMemberNotFoundException(id);
    }

    return existingTenantMemberViewModel;
  }
}
