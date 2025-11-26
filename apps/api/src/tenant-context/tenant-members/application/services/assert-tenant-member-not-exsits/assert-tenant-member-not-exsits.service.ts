import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { TenantMemberAlreadyExistsException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-already-exists/tenant-member-already-exists.exception';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantMemberNotExsistsService
  implements IBaseService<{ tenantId: string; userId: string }, void>
{
  private readonly logger = new Logger(
    AssertTenantMemberNotExsistsService.name,
  );

  constructor(
    @Inject(TENANT_MEMBER_WRITE_REPOSITORY_TOKEN)
    private readonly tenantMemberWriteRepository: TenantMemberWriteRepository,
  ) {}

  async execute(input: { tenantId: string; userId: string }): Promise<void> {
    const { tenantId, userId } = input;

    this.logger.log(
      `Asserting tenant member not exists by tenant id: ${tenantId} and user id: ${userId}`,
    );

    // 01: Find the tenant member by id
    const existingTenantMember =
      await this.tenantMemberWriteRepository.findByTenantIdAndUserId(
        tenantId,
        userId,
      );

    // 02: If the tenant member exists, throw an error
    if (existingTenantMember) {
      this.logger.error(
        `Tenant member with tenant id ${tenantId} and user id ${userId} already exists`,
      );
      throw new TenantMemberAlreadyExistsException(tenantId, userId);
    }
  }
}
