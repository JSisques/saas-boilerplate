import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type TenantMemberPrimitives = BasePrimitives & {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
};
