export type AuthMongoDbDto = {
  id: string;
  userId: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  lastLoginAt: Date | null;
  passwordHash: string;
  provider: string;
  providerId: string | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
