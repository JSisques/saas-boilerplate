import { BaseMongoDatabaseRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-database.repository';
import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Db } from 'mongodb';

/**
 * Base class for MongoDB tenant database repositories.
 * Extends BaseMongoDatabaseRepository to provide common MongoDB operations for tenant databases.
 */
export abstract class BaseMongoTenantRepository extends BaseMongoDatabaseRepository {
  constructor(
    protected readonly mongoTenantService: MongoTenantService,
    protected readonly tenantContextService: TenantContextService,
  ) {
    super();
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
   * Get the MongoDB database instance for the tenant
   * @returns Db instance for the tenant
   */
  protected async getTenantDatabase(): Promise<Db> {
    const tenantId = this.tenantId;
    return this.mongoTenantService.getTenantDatabase(tenantId);
  }
}
