import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';

export const TENANT_WRITE_REPOSITORY_TOKEN = Symbol('TenantWriteRepository');

export interface TenantWriteRepository {
  findById(id: string): Promise<TenantAggregate | null>;
  findBySlug(slug: string): Promise<TenantAggregate | null>;
  save(tenant: TenantAggregate): Promise<TenantAggregate>;
  delete(id: string): Promise<boolean>;
}
