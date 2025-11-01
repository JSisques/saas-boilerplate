import { AuthProviderEnum } from '@prisma/client';

export type AuthPrismaDto = {
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
