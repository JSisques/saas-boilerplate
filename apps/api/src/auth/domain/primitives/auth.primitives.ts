export type AuthPrimitives = {
  id: string;
  userId: string;
  email: string | null;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  passwordHash: string | null;
  phoneNumber: string | null;
  provider: string;
  providerId: string | null;
  twoFactorEnabled: boolean;
};
