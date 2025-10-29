import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';

export const TENANT_MEMBER_READ_REPOSITORY_TOKEN = Symbol(
  'TenantMemberReadRepository',
);

export interface TenantMemberReadRepository {
  findById(id: string): Promise<TenantMemberViewModel | null>;
  findByTenantId(tenantId: string): Promise<TenantMemberViewModel[] | null>;
  findByUserId(userId: string): Promise<TenantMemberViewModel[] | null>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<TenantMemberViewModel>>;
  save(tenantMemberViewModel: TenantMemberViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
