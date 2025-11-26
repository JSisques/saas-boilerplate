import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';
import { TenantMemberRoleEnum } from '@prisma/client';

export type TenantMemberPrismaDto = BasePrismaDto & {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantMemberRoleEnum;
};
