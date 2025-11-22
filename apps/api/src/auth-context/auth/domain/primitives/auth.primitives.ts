import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type AuthPrimitives = BasePrimitives & {
  id: string;
  userId: string;
  email: string | null;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  password: string | null;
  phoneNumber: string | null;
  provider: string;
  providerId: string | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
