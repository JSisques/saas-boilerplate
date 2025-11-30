/**
 * User creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a auth is created, tailored for presentation layers.
 *
 * @interface IAuthCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the auth.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} email - The email of the auth.
 * @property {boolean} emailVerified - The email verified of the auth.
 * @property {Date | null} lastLoginAt - The last login at of the auth.
 * @property {string | null} password - The password of the auth.
 * @property {string | null} phoneNumber - The phone number of the auth.
 * @property {string} provider - The provider of the auth.
 * @property {string | null} providerId - The provider id of the auth.
 * @property {boolean} twoFactorEnabled - The two factor enabled of the auth.
 */
export interface IAuthCreateViewModelDto {
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
  createdAt: Date;
  updatedAt: Date;
}
