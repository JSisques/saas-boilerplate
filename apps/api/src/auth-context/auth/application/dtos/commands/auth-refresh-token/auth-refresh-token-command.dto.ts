/**
 * Data Transfer Object for refresh token via command layer.
 *
 * @interface IAuthRefreshTokenCommandDto
 * @property {string} refreshToken - The refresh token to use for generating a new access token.
 */
export interface IAuthRefreshTokenCommandDto {
  refreshToken: string;
}
