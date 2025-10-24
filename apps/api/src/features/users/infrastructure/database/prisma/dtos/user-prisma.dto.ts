import { RoleEnum, StatusEnum } from '@prisma/client';

export type UserPrismaDto = {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: RoleEnum;
  status: StatusEnum;
  userName: string | null;
};
