import { TenantMemberRoleEnum } from '@prisma/client';

export type TenantMemberPrismaDto = {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantMemberRoleEnum;
};
