import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IAuthEventData extends IBaseEventData {
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
}
