import { IBaseService } from '@/shared/application/services/base-service.interface';
import { TenantSlugIsNotUniqueException } from '@/tenant-context/tenants/application/exceptions/tenant-slug-is-not-unique/tenant-slug-is-not-unique.exception';
import {
  TENANT_WRITE_REPOSITORY_TOKEN,
  TenantWriteRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertTenantSlugIsUniqueService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(AssertTenantSlugIsUniqueService.name);

  constructor(
    @Inject(TENANT_WRITE_REPOSITORY_TOKEN)
    private readonly tenantWriteRepository: TenantWriteRepository,
  ) {}

  async execute(slug: string): Promise<void> {
    this.logger.log(`Asserting tenant slug is unique by slug: ${slug}`);

    // 01: Find the tenant by slug
    const existingTenant = await this.tenantWriteRepository.findBySlug(slug);

    // 02: If the tenant slug exists, throw an error
    if (existingTenant) {
      this.logger.error(`Tenant slug ${slug} is already taken`);
      throw new TenantSlugIsNotUniqueException(slug);
    }
  }
}
