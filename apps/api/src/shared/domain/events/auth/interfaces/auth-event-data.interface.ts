import { IEventDataWithTenantContext } from '@/shared/domain/interfaces/event-data-with-tenant-context.interface';

/**
 * Event data interface for auth-related events.
 * Extends IEventDataWithTenantContext to support both global and tenant-specific auth operations.
 */
export interface IAuthEventData extends IEventDataWithTenantContext {
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
