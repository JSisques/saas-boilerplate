import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export abstract class BaseTypeormTenantRepository extends BaseDatabaseRepository {
  constructor(
    protected readonly typeormTenantService: TypeormTenantService,
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
   * Get the TypeORM DataSource for the tenant
   * @returns DataSource instance for the tenant
   */
  protected async getTenantDataSource(): Promise<DataSource> {
    const tenantId = this.tenantId;
    return this.typeormTenantService.getTenantDataSource(tenantId);
  }
}
