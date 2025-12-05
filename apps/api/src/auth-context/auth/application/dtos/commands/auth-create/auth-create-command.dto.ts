/**
 * Data Transfer Object for creating a new auth via command layer.
 *
 * @interface IAuthCreateCommandDto
 * @property {string} userId - The unique identifier of the user. Must be provided.
 * @property {string} [email] - The email of the auth. Can be null if not provided.
 * @property {string} [password] - The password of the auth (hashed). Can be null if not provided.
 * @property {boolean} [emailVerified] - Whether the email is verified. Defaults to false.
 * @property {string} [phoneNumber] - The phone number of the auth. Can be null if not provided.
 * @property {string} provider - The authentication provider (LOCAL, GOOGLE, APPLE). Must be provided.
 * @property {string} [providerId] - The provider id of the auth. Can be null if not provided.
 * @property {boolean} [twoFactorEnabled] - Whether two-factor authentication is enabled. Defaults to false.
 * @property {Date} [lastLoginAt] - The last login timestamp. Can be null if not provided.
 */
export interface IAuthCreateCommandDto {
  id?: string | null;
  userId: string;
  email?: string | null;
  password?: string | null;
  emailVerified?: boolean;
  phoneNumber?: string | null;
  provider: string;
  providerId?: string | null;
  twoFactorEnabled?: boolean;
  lastLoginAt?: Date | null;
}
