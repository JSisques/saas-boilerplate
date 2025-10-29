import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';

export const TENANT_MEMBER_WRITE_REPOSITORY_TOKEN = Symbol(
  'TenantMemberWriteRepository',
);

export interface TenantMemberWriteRepository {
  findById(id: string): Promise<TenantMemberAggregate | null>;
  findByTenantId(tenantId: string): Promise<TenantMemberAggregate[] | null>;
  findByUserId(userId: string): Promise<TenantMemberAggregate[] | null>;
  findByTenantIdAndUserId(
    tenantId: string,
    userId: string,
  ): Promise<TenantMemberAggregate | null>;
  save(tenantMember: TenantMemberAggregate): Promise<TenantMemberAggregate>;
  delete(id: string): Promise<boolean>;
}
