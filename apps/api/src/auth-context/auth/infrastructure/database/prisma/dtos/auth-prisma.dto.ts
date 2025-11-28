import { AuthProviderEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type AuthPrismaDto = BasePrismaDto & {
  id: string;
  userId: string;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  lastLoginAt: Date | null;
  password: string | null;
  provider: AuthProviderEnum;
  providerId: string | null;
  twoFactorEnabled: boolean;
};
