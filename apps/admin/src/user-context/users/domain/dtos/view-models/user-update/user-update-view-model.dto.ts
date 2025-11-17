import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';

/**
 * Data Transfer Object for updating a user view model.
 *
 * @type IUserUpdateViewModelDto
 * @property {string | null} userName - The username of the user (nullable).
 * @property {string | null} name - The first name of the user (nullable).
 * @property {string | null} lastName - The last name of the user (nullable).
 * @property {string | null} bio - The user's biography (nullable).
 * @property {string | null} avatarUrl - The URL to the user's avatar image (nullable).
 * @property {string} role - The role assigned to the user.
 * @property {string} status - The current status of the user.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updatedAt - Timestamp when the user was last updated.
 */
export type IUserUpdateViewModelDto = Partial<
  Omit<IUserCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
>;




