/**
 * Data Transfer Object for login by email via command layer.
 *
 * @interface IAuthLoginByEmailCommandDto
 * @property {string} email - The email of the auth.
 * @property {string} password - The password of the auth.
 */
export interface IAuthLoginByEmailCommandDto {
  email: string;
  password: string;
}
