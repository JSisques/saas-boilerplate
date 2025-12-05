import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';

export const TENANT_DATABASE_WRITE_REPOSITORY_TOKEN = Symbol(
  'TenantDatabaseWriteRepository',
);

export interface TenantDatabaseWriteRepository {
  findById(id: string): Promise<TenantDatabaseAggregate | null>;
  findByTenantId(tenantId: string): Promise<TenantDatabaseAggregate | null>;
  save(
    tenantDatabase: TenantDatabaseAggregate,
  ): Promise<TenantDatabaseAggregate>;
  delete(id: string): Promise<boolean>;
}
