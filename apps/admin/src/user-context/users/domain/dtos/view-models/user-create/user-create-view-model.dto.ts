/**
 * User creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a user is created, tailored for presentation layers.
 *
 * @interface IUserCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the user.
 * @property {string} userName - The username of the user.
 * @property {string | null} name - The first name of the user (nullable).
 * @property {string | null} lastName - The last name of the user (nullable).
 * @property {string | null} bio - The user's biography (nullable).
 * @property {string | null} avatarUrl - The URL to the user's avatar image (nullable).
 * @property {string} role - The role assigned to the user.
 * @property {string} status - The current status of the user.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updatedAt - Timestamp when the user was last updated.
 */
export interface IUserCreateViewModelDto {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: string;
  status: string;
  userName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
