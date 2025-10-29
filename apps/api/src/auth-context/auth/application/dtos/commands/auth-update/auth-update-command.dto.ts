/**
 * Data Transfer Object for updating a auth via command layer.
 *
 * @interface IAuthUpdateCommandDto
 * @property {string} id - The id of the auth to update.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} [email] - The email of the auth.
 * @property {boolean} [emailVerified] - The email verified of the auth.
 * @property {Date | null} [lastLoginAt] - The last login at of the auth.
 * @property {string | null} [passwordHash] - The password hash of the auth.
 * @property {string} [provider] - The provider of the auth.
 * @property {string | null} [providerId] - The provider id of the auth.
 * @property {boolean} [twoFactorEnabled] - The two factor enabled of the auth.
 */
export interface IAuthUpdateCommandDto {
  id: string;
  email?: string;
  emailVerified?: boolean;
  lastLoginAt?: Date | null;
  passwordHash?: string | null;
  phoneNumber?: string;
  provider?: string;
  providerId?: string | null;
  twoFactorEnabled?: boolean;
}
