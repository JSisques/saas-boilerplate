import { StatusEnum, UserRoleEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type UserPrismaDto = BasePrismaDto & {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: UserRoleEnum;
  status: StatusEnum;
  userName: string;
};
