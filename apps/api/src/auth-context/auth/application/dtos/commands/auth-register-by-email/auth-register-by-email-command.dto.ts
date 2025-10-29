/**
 * Data Transfer Object for registering a new auth by email via command layer.
 *
 * @interface IAuthRegisterByEmailCommandDto
 * @property {string} userId - The unique identifier of the user.
 * @property {AuthProviderEnum} provider - The authentication provider (LOCAL, GOOGLE, APPLE).
 * @property {string} [email] - The email of the auth (required for LOCAL provider).
 * @property {string} [password] - The password of the auth (required for LOCAL provider).
 * @property {string} [providerId] - The provider id of the auth (required for GOOGLE/APPLE providers).
 * @property {string} [accessToken] - The access token from the provider (for GOOGLE/APPLE).
 * @property {string} [refreshToken] - The refresh token from the provider (for GOOGLE/APPLE).
 */
export interface IAuthRegisterByEmailCommandDto {
  email?: string;
  password?: string;
}
