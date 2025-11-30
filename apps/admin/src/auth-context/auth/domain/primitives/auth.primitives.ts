export type AuthPrimitives = {
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
};
