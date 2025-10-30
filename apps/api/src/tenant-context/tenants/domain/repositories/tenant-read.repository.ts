import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';

export const TENANT_READ_REPOSITORY_TOKEN = Symbol('TenantReadRepository');

export interface TenantReadRepository {
  findById(id: string): Promise<TenantViewModel | null>;
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<TenantViewModel>>;
  save(tenantViewModel: TenantViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
