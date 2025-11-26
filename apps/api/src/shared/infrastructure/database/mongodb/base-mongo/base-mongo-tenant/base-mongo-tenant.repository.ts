import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';

export abstract class BaseMongoTenantRepository extends BaseDatabaseRepository {
  protected abstract readonly tenantId: string;

  constructor(protected readonly mongoTenantService: MongoTenantService) {
    super();
    this.logger = new Logger(this.constructor.name);
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
