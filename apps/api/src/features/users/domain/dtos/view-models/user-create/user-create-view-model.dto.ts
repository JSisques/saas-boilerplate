/**
 * Data Transfer Object for creating a user view model.
 *
 * @interface IUserCreateViewModelDto
 * @property {string} id - The immutable identifier of the user.
 * @property {string} name - The name of the user.
 * @property {string} bio - The bio of the user.
 * @property {string} avatar - The avatar of the user.
 * @property {Date} createdAt - The date and time the user was created.
 * @property {Date} updatedAt - The date and time the user was last updated.
 */
export interface IUserCreateViewModelDto {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
