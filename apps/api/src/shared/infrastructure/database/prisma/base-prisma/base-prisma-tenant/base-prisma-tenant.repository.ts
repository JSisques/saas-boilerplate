import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { PrismaClientExtended } from '@/shared/infrastructure/database/prisma/clients/custom-prisma-client/custom-prisma-client';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant/prisma-tenant.service';
import { Logger } from '@nestjs/common';

export abstract class BasePrismaTenantRepository extends BaseDatabaseRepository {
  protected abstract readonly tenantId: string;

  constructor(protected readonly prismaTenantService: PrismaTenantService) {
    super();
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Get the Prisma client for the tenant
   * @returns PrismaClientExtended instance for the tenant
   */
  protected async getTenantClient(): Promise<PrismaClientExtended> {
    if (!this.tenantId) {
      // TODO: Add a better error message
      throw new Error('Tenant ID is required but not set');
    }
    return this.prismaTenantService.getTenantClient(this.tenantId);
  }
}
