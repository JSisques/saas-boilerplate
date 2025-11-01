import { StatusEnum, UserRoleEnum } from '@prisma/client';

export type UserPrismaDto = {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: UserRoleEnum;
  status: StatusEnum;
  userName: string;
};
