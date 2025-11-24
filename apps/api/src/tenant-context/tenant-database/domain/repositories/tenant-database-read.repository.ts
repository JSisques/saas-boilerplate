import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';

export const TENANT_DATABASE_READ_REPOSITORY_TOKEN = Symbol(
  'TenantDatabaseReadRepository',
);

export interface TenantDatabaseReadRepository {
  findById(id: string): Promise<TenantDatabaseViewModel | null>;
  findByTenantId(tenantId: string): Promise<TenantDatabaseViewModel[] | null>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<TenantDatabaseViewModel>>;
  save(tenantDatabaseViewModel: TenantDatabaseViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
