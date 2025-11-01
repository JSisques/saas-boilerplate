export type AuthMongoDbDto = {
  id: string;
  userId: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  lastLoginAt: Date | null;
  password: string;
  provider: string;
  providerId: string | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
