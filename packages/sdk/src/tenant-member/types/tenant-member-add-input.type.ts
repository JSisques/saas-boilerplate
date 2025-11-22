import type { TenantMemberRole } from './tenant-member-role.type.js';

export type TenantMemberAddInput = {
  tenantId: string;
  userId?: string;
  role: TenantMemberRole;
};

