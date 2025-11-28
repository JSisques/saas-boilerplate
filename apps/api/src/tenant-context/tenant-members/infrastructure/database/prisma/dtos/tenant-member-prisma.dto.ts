import { TenantMemberRoleEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type TenantMemberPrismaDto = BasePrismaDto & {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantMemberRoleEnum;
};
