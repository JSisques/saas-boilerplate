import { AuthCreatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-created-at/auth-created-at.vo';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUpdatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-updated-at/auth-updated-at.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

/**
 * Interface representing the structure required to create a new auth entity.
 *
 * @interface IAuthCreateDto
 * @property {AuthUuidValueObject} id - The unique identifier for the auth.
 * @property {UserUuidValueObject} userId - The unique identifier for the user.
 * @property {AuthEmailValueObject} email - The email of the auth.
 * @property {AuthEmailVerifiedValueObject} emailVerified - The email verified of the auth.
 * @property {AuthLastLoginAtValueObject} lastLoginAt - The last login at of the auth.
 * @property {AuthPasswordValueObject} password - The password of the auth.
 * @property {AuthPhoneNumberValueObject} phoneNumber - The phone number of the auth.
 * @property {AuthProviderValueObject} provider - The provider of the auth.
 * @property {AuthProviderIdValueObject} providerId - The provider id of the auth.
 * @property {AuthTwoFactorEnabledValueObject} twoFactorEnabled - The two factor enabled of the auth.
 * @property {AuthCreatedAtValueObject} createdAt - The created at of the auth.
 * @property {AuthUpdatedAtValueObject} updatedAt - The updated at of the auth.
 */
export interface IAuthCreateDto {
  id: AuthUuidValueObject;
  userId: UserUuidValueObject;
  email: AuthEmailValueObject | null;
  emailVerified: AuthEmailVerifiedValueObject;
  lastLoginAt: AuthLastLoginAtValueObject | null;
  password: AuthPasswordValueObject | null;
  phoneNumber: AuthPhoneNumberValueObject | null;
  provider: AuthProviderValueObject;
  providerId: AuthProviderIdValueObject | null;
  twoFactorEnabled: AuthTwoFactorEnabledValueObject;
  createdAt: AuthCreatedAtValueObject;
  updatedAt: AuthUpdatedAtValueObject;
}
