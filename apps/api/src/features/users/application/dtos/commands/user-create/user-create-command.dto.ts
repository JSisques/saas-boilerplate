/**
 * Data Transfer Object for creating a new user via command layer.
 *
 * @interface IUserCreateCommandDto
 * @property {string | null} avatarUrl - The URL of the user's avatar. Can be null if not provided.
 * @property {string | null} bio - The biography of the user. Can be null if not provided.
 * @property {string | null} lastName - The user's last name. Can be null if not provided.
 * @property {string | null} name - The user's first name. Can be null if not provided.
 * @property {string} role - The user's role. Must be provided.
 * @property {string} status - The user's status. Must be provided.
 * @property {string | null} userName - The user's username. Can be null if not provided.
 */
export interface IUserCreateCommandDto {
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: string;
  status: string;
  userName: string | null;
}
