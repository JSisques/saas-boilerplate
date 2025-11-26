import { BaseMongoDatabaseRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-database.repository';
import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { Db } from 'mongodb';

/**
 * Base class for MongoDB tenant database repositories.
 * Extends BaseMongoDatabaseRepository to provide common MongoDB operations for tenant databases.
 */
export abstract class BaseMongoTenantRepository extends BaseMongoDatabaseRepository {
  protected abstract readonly tenantId: string;

  constructor(protected readonly mongoTenantService: MongoTenantService) {
    super();
  }

  /**
   * Get the MongoDB database instance for the tenant
   * @returns Db instance for the tenant
   */
  protected async getTenantDatabase(): Promise<Db> {
    if (!this.tenantId) {
      // TODO: Add a better error message
      throw new Error('Tenant ID is required but not set');
    }
    return this.mongoTenantService.getTenantDatabase(this.tenantId);
  }
}
