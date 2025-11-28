import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { PrismaTenantClientExtended } from '@/shared/infrastructure/database/prisma/clients/custom-prisma-tenant-client/custom-prisma-tenant-client';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant/prisma-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Logger } from '@nestjs/common';

export abstract class BasePrismaTenantRepository extends BaseDatabaseRepository {
  constructor(
    protected readonly prismaTenantService: PrismaTenantService,
    protected readonly tenantContextService: TenantContextService,
  ) {
    super();
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Get tenant ID from tenant context service (lazy evaluation)
   * @returns Tenant ID
   * @throws Error if tenant ID is not found
   */
  protected get tenantId(): string {
    return this.tenantContextService.getTenantIdOrThrow();
  }

  /**
   * Get the Prisma client for the tenant
   * @returns PrismaClientExtended instance for the tenant
   */
  protected async getTenantClient(): Promise<PrismaTenantClientExtended> {
    const tenantId = this.tenantId;
    return this.prismaTenantService.getTenantClient(tenantId);
  }
}
