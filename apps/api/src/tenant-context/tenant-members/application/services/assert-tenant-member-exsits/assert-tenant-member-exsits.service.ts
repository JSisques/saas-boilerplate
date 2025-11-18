import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantMemberExsistsService
  implements IBaseService<string, TenantMemberAggregate>
{
  private readonly logger = new Logger(AssertTenantMemberExsistsService.name);

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
  ) {}

  async execute(id: string): Promise<TenantMemberAggregate> {
    this.logger.log(`Asserting tenant member exists by id: ${id}`);

    // 01: Find the tenant member by id
    const existingTenantMember =
      await this.tenantMemberWriteRepository.findById(id);

    // 02: If the tenant does not exist, throw an error
    if (!existingTenantMember) {
      this.logger.error(`Tenant member not found by id: ${id}`);
      throw new TenantMemberNotFoundException(id);
    }

    return existingTenantMember;
  }
}
