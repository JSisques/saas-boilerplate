export interface IAuthEventData {
  id: string;
  userId: string;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  lastLoginAt: Date | null;
  password: string | null;
  provider: string;
  providerId: string | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
