export type AuthResponse = {
  id: string;
  userId: string;
  email?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  provider?: string;
  providerId?: string;
  twoFactorEnabled?: boolean;
};

