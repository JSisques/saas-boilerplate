import type { TenantMemberRole } from './tenant-member-role.type.js';

export type TenantMemberUpdateInput = {
  id: string;
  role?: TenantMemberRole;
};

